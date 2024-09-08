import db from '../models/index'
import bcrypt from 'bcryptjs';

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

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers
}