// get save user token, Is admin?

// save user(user, Token, IsAdmin)



/****************************************
 * 
 *    Local storage
 * 
 ***************************************/

export const saveLocalUser=(user)=>{
    localStorage.setItem('user',JSON.stringify(user));
}

export const deleteLocalUser=(user)=>{
    localStorage.removeItem('user')
    //localStorage.setItem('user',JSON.stringify(user));
}


/****************************************
 * 
 * save posts
 * 
 ************************************************/

export const savePosts = (posts)=>{
    localStorage.setItem('posts',JSON.stringify(posts));
}

/****************************************
 * 
 * get posts
 * 
 ************************************************/

 export const getPost = () => {

    let posts = localStorage.getItem("posts");

    if (posts == null) {

        return [];
    }
    else {
        return JSON.parse(posts);
    }
}



/**
 * 
 * Get the user
 * 
 */

 export const getUser = () => {
    let user = localStorage.getItem("user");

    if (user == null) {
        return {
            loggedIn:false,
            userId:null,
            token:null
        };
    }
    else {
        return JSON.parse(user);
    }
}