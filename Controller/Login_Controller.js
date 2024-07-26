const LoginDB = require("../Model/Login_Model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.JWT_SECRET_KEY; // Load secret key from environment variable

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Create new user
exports.create = async (req, res) => {
    if (!req.body) {
        return res.status(400).send("Content can't be empty");
    }

    const { UserName, Email, Password } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new LoginDB({
        UserName,
        Email,
        Password: hashedPassword,
    });

    newUser.save()
        .then(data => {
            res.status(200).send({ status: true, message: "User created successfully", data });
        })
        .catch(error => {
            res.status(500).send({ message: error.message });
        });
};

// Login user and generate JWT token
exports.login = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        const user = await LoginDB.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(Password, user.Password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, email: user.Email }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users (protected route)
exports.getAll = async (req, res) => {
    try {
        const records = await LoginDB.find().select('-__v');
        const responseData = {
            message: 'All users fetched successfully',
            data: records,
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Error fetching records', message: error.message });
    }
};

// Get user by ID (protected route)
exports.getById = async (req, res) => {
    try {
        const record = await LoginDB.findById(req.params.id).select('-__v');
        if (!record) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User fetched successfully', data: record });
    } catch (error) {
        console.error('Error fetching record:', error);
        res.status(500).json({ error: 'Error fetching record', message: error.message });
    }
};

// Update user by ID (protected route)
exports.updateById = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: 'Data to update cannot be empty!' });
    }

    const id = req.params.id;

    try {
        const updatedRecord = await LoginDB.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).select('-__v');
        if (!updatedRecord) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', data: updatedRecord });
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ error: 'Error updating record', message: error.message });
    }
};

  // delete method
  exports.delete = (req, res) => {
    const id = req.params.id
    LoginDB.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(400).send(`category not found with ${id}`)
            } else {
                res.send("category deleted successfully")
            }
        })
        .catch(error => {
            res.status(500).send(error)
        })
}
// Export middleware
exports.authenticateJWT = authenticateJWT;