import { hash } from "../lib/password.js";
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
        // Your route logic to handle creating a new user
        const { name, surname, login, password } = req.body
        let user = new User()
        user.name = name
        user.surname = surname
        user.login = login
        user.password = await hash(password)

        user
        .save()
        .then(r => {
            res.send({ status: "ok", message: "User has been added successfully" })
        })
        .catch(err => {
            if(err) res.send({status:"ERROR", message:err.message})
        })
    });

    app.get("/user/:id", (req, res) => {
        // Your route logic for getting a user by ID
    });

    app.put("/user/:id", (req, res) => {
        // Your route logic for updating a user by ID
    });

    app.delete("/user/:id", (req, res) => {
        // Your route logic for deleting a user by ID
    });
}


/*

 post/user
   -validation 
   -unique logins
   - bcrypt password hash 


 post/login
     login, password

     response: {status:'error', 'no such login'}
     response: {status:'error', 'password is wrong'}

     response {status: 'success'}





*/