import { where } from 'sequelize';
import db from '../models/index'
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise ( async(resolve, reject) => {
        try{
            let userData ={};

            let isExist = await checkUserEmail(email);
            if(isExist) {
                let user = await db.User.findOne({
                    where: {email: email},
                    attributes: ['email', 'roleId','password'],
                    raw : true
                });
                if (user) {
                    let check = await bcrypt.compareSync( password, user.password);
                    if(check) {
                        userData.errCode = 0;
                        userData.errMessage = " OK";
                        delete user.password;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = `Your's password is wrong!`;
                    }
                }
                else {
                    userData.errCode = 2;
                    userData.errMessage = `Your's password not found!`
                }
            }
            else {
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist. pls try other email!`
            }
            resolve(userData)
        }
        catch(e) {
            reject(e)
        }
    })
}


let checkUserEmail = (userEmail) => {
    return new Promise (async (resolve, reject) => {
        try{
            let user = await db.User.findOne ({
                where: { email: userEmail}
            })
            
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        }catch (e){
            reject(e)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise (async(resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password','phonenumber']
                    }
                })
            }if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: {id : userId},
                    attributes: {
                        exclude: ['password','phonenumber']
                    }
                })
            }
            resolve(users)
        }
        catch(e) {
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise( async(resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        }
        catch(e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async(resolve,reject) => {
        try{
            //check email is exist ???
            let check = await checkUserEmail(data.email);
            if(check === true) {
                resolve({
                    errCode: 1,
                    Message: 'your email in used, plz try another email!'
                })
            }
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })

            resolve({
                errCode: 0,
                Message: 'OK'
            })
        }
        catch(e) {
            reject(e)
        }
    }) 
}

let deleteUser= (userId) => {
    return new Promise (async(resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId },
            raw: false
        })
        if (!user) {
            resolve ({
                errCode: 3,
                errMessage: `the user isn't exist!`
            })
        }
        await user.destroy();
        resolve({
            errCode: 0,
            errMessage: `the user is deleted`
        })
    })
}

let updataUserData = (data) => {
    return new Promise (async (resolve,reject) => {
        try{
            if(!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: `Missing required parameters!`
                });
            }

            let user = await db.User.findOne ({
                where: {id: data.id},
                raw: false
            })
            if (user) {
                    user.firstName = data.firstName,
                    user.lastName = data.lastName,
                    user.address = data.address
                
                    await user.save();
                resolve({
                    errCode: 0,
                    errMessage: `Update user is success!`
                });
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: `can't found this user!`
                });
            }
        }
        catch (e){
            console.log(e)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updataUserData: updataUserData
}