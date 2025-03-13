// Here we define all usefull types which is used in application (zod infer types or not define here)

 type LoginResponse = {
    data:{
    user:any,
    permissions:any,
    token:string
    }
 
};



export type {LoginResponse}