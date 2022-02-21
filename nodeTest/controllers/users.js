import { v4 as uuidv4 } from 'uuid';

let users = [];


// 여기서는 /users가 default.
export const getUsers = (req, res) => {
    console.log(users);
    res.send(users);
};
//add user
export const createUser = (req, res)=> {
    const user = req.body;
    const userWithId = { ...user, id:uuidv4()};
    
    users.push(userWithId);
    res.send(`username ${user.firstName}`);
};
//find user
export const getUser = (req, res) => {
    const { id } = req.params;

    const foundUser = users.find((user) => user.id == id);
    res.send(foundUser);
};
//delete user
export const deleteUser = (req, res) => {
    const {id} = req.params;

    users = users.filter((user) => user.id != id);

    res.send(`user delete ${id}`);
};
//update user
export const updateUser = (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, age} = req.body;

    const user = users.find((user) => user.id == id);

    if(firstName){
        user.firstName = firstName;
    }

    if(lastName){
        user.lastName = lastName;
    }

    if(age){
        user.age = age;
    }

    res.send('user ${id} has been updated');
};