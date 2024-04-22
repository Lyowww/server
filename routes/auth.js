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
        const { name, surname, login, password } = req.body
        let user = new User()
        user.name = name
        user.surname = surname
        user.login = login
        let result = validation(password)
        user.password = result.valid ? await hash(password) : res.status(403).json({ status: "ERROR", message: err.message })
        user
            .save()
            .then(r => {
                res.send({ status: "ok", message: "User has been added successfully" })
            })
            .catch(err => {
                if (err) res.status(404).json({ status: "ERROR", message: err.message })
            })
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
}


/*

post/user
- validation +
- unique logins
- bcrypt password hash +
*/