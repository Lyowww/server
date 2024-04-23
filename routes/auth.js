import { hash, verify, validation } from "../lib/password.js";
import { User } from "../models/init.js";

export const AuthInit = (app) => {

    /**
     * @swagger
     * /user:
     *   post:
     *     summary: Create a new user
     *     description: Register a new user with the provided information
     *     parameters:
     *       - in: body
     *         name: name
     *         description: The user's first name
     *         required: true
     *         schema:
     *           type: string
     *       - in: body
     *         name: surname
     *         description: The user's last name
     *         required: true
     *         schema:
     *           type: string
     *       - in: body
     *         name: login
     *         description: The user's login username
     *         required: true
     *         schema:
     *           type: string
     *       - in: body
     *         name: password
     *         description: The user's login password
     *         required: true
     *         schema:
     *           type: string
     *           format: password
     *     responses:
     *       201:
     *         description: User created successfully
     *       400:
     *         description: Bad request, missing or invalid parameters
     */
    app.post("/user", async (req, res) => {
        const { name, surname, login, password } = req.body;
        if (!name || !surname || !login || !password) {
            return res.status(400).json({ status: "ERROR", message: "Missing or invalid parameters" });
        }

        try {
            const existingUser = await User.findOne({ login });
            if (existingUser) {
                return res.status(409).json({ status: "ERROR", message: "Login has already been used." });
            }
            const hashedPassword = validation(password).valid ? await hash(password) : res.status(400).json({ status: "ERROR", message: validation(password).message });
            const newUser = new User({
                name,
                surname,
                login,
                password: hashedPassword
            });
            const savedUser = await newUser.save();
            res.status(201).json({ status: "ok", message: "User has been added successfully" });
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ status: "ERROR", message: "Internal Server Error" });
        }
    });

    /**
     * @swagger
     * /user/{id}:
     *   get:
     *     summary: Get user by ID
     *     description: Retrieve user information based on user ID
     *     parameters:
     *       - in: path
     *         name: id
     *         description: ID of the user
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User found
     *       404:
     *         description: User not found
     *       500:
     *         description: Server error
     */

    app.get("/user/:id", async (req, res) => {
        const userId = req.params.id
        try {
            const us = await User.findById(userId);
            if (!us) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(us);
        } catch (error) {
            console.error("Error retrieving user:", error);
            res.status(500).json({ error: "Server error" });
        }
    });

    /**
     * @swagger
     * /user/{id}:
     *   put:
     *     summary: Update user by ID
     *     description: Update user information based on user ID
     *     parameters:
     *       - in: path
     *         name: id
     *         description: ID of the user
     *         required: true
     *         schema:
     *           type: string
     *       - in: body
     *         name: user
     *         description: Updated user object
     *         required: true
     *         schema:
     *           type: object
     *           properties:
     *             name:
     *               type: string
     *             surname:
     *               type: string
     *             login:
     *               type: string
     *     responses:
     *       200:
     *         description: User updated successfully
     *       404:
     *         description: User not found
     *       500:
     *         description: Server error
     */

    app.put("/user/:id", async (req, res) => {
        const userId = req.params.id;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            user.name = req.body.name;
            user.surname = req.body.surname;
            user.login = req.body.login;
            user
                .save()
                .then(r => {
                    res.send({ status: "ok", message: "User has been updated successfully" })
                })
                .catch(err => {
                    if (err) res.status(404).json({ status: "ERROR", message: err.message })
                })
        } catch (error) {
            console.error("Error retrieving user:", error);
            res.status(500).json({ error: "Server error" });
        }
    });

    /**
     * @swagger
     * /user/{id}:
     *   delete:
     *     summary: Delete user by ID
     *     description: Delete user information based on user ID
     *     parameters:
     *       - in: path
     *         name: id
     *         description: ID of the user
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User deleted successfully
     *       404:
     *         description: User not found
     *       500:
     *         description: Server error
     */

    app.delete("/user/:id", async (req, res) => {
        try {
            const id = req.params.id;
            const deletedUser = await User.findByIdAndDelete(id);

            if (deletedUser) {
                res.send(`User with ID ${id} has been deleted.`);
            } else {
                res.status(404).send('User not found.');
            }
        } catch (error) {
            res.status(500).send('Error deleting user.');
        }
    });

    /**
* @swagger
* /signIn/{login}/{password}:
*   post:
*     summary: Sign in user
*     description: Sign in a user with provided login and password
*     parameters:
*       - in: path
*         name: login
*         description: User's login
*         required: true
*         schema:
*           type: string
*       - in: path
*         name: password
*         description: User's password
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: User has signed in successfully
*       401:
*         description: Incorrect password
*       404:
*         description: User not found
*       500:
*         description: Server error
*/


    app.post("/signIn/:login/:password", async (req, res) => {
        const userLogin = req.params.login;
        const userPassword = req.params.password;
        try {
            const user = await User.findOne({ login: userLogin });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const passwordMatch = await verify(userPassword, user.password);
            if (passwordMatch) {
                return res.status(200).json({ status: "ok", message: "User has signed successfully" });
            } else {
                return res.status(401).json({ status: "ERROR", error: "Incorrect password" });
            }
        } catch (error) {
            console.error("Error retrieving user:", error);
            res.status(500).json({ error: "Server error" });
        }
    });
}


/*

post/user
- validation +
- unique logins +
- bcrypt password hash +
*/