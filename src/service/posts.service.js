import { getUserName } from './api.service';
import { savePosts } from './auth.service';

 /*export const  getPostUserName = (posts, token) => {
    let postWithName = [];
    //let listOwner = [];

    if (posts.length > 0) {

        posts.forEach(post => {
            
           return  getUserName(post.userId, token)
                .then((userName) => {

                    //listOwner.push({userName:userName,userId:post.userId});               
                    postWithName= posts.map((post /*,i/)=>{
                        //return /*post.userId===listOwner[i].userId?/ {...post,userName:listOwner[i]./userName}/*:{...post}/
                        return /*post.userId===listOwner[i].userId?/ {...post,userName:userName}/*:{...post}/

                    })
                    console.log("AApostWithName: ",postWithName);
                    savePosts(postWithName.reverse());
                    return postWithName;
                })
                
            
                .catch((e) => {
                    console.log(e);
                });/
        });

        return postWithName;
        
    } else {
        savePosts(postWithName);
        console.log('No post updated ');
    }
};*/

export const  getPostUserName = (posts, token) => {
    let postWithName = [];

    if (posts.length > 0) {

        
        for (const post of posts) {
            let ownerId = post.userId;

         return  getUserName(post.userId, token)
                .then((userName) => {

                    
                    postWithName= posts.map((post )=>{
                        return  post.userId===ownerId?{...post,userName:userName}:{...post}
                    })

                    savePosts(postWithName.reverse());
                    
                })
                .catch((e) => {
                    console.log(e);
                });
        }
        console.log("FFF: ",postWithName);
       // return postWithName;
    } else {
        savePosts(postWithName);
        console.log('No post updated ');
    }
};

export const getLikeValue = (user, post) => {
    return post.usersLiked.includes(user.userId) ? 0 : 1;
};
