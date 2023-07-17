/*import '../css/style.css'
import { io, Socket } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { getUserList } from '../service/api.service';
import { useEffect, useState } from 'react';
import { saveUserListe, selectUserListe } from '../features/userListeSlice';
import { getChats, saveChate } from '../service/chat';

function Chat() {
    const user = useSelector(selectUser);
    const userListe = useSelector(selectUserListe);
    const [userActif,setUseActif]= useState([]);
    const [message,setMessage]=useState(null);
    const [room,setRoom] = useState(null);
    const [connected,setConnected] = useState(false);
    const [lastMessages,setLastMessage]=useState([])

    const dispatch = useDispatch();
    const socket = io.connect('http://localhost:3000');
        //console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    socket.emit("join_room",user.userId);
    setConnected(true);

    /*socket.on('connection',()=>{
        console.log(socket.id); // x8WIv7-mJelg7on_ALbx

    })/

    //io.connect('http://localhost:3000');
    

    const sendMessage =(e)=>{
        e.preventDefault();

        (message&&room)?
        socket.emit("send_message",{message,room})
        : alert("Veillez sélectionné un message")

    }

    const getUserListf =()=>{

        getUserList(user.token)
        .then(userList=>{
            let localUserList = userList.map(user=>{return {id:user._id,userName:user.userName}})
            dispatch(saveUserListe(localUserList));
        })
        .catch((e) => console.log(e))
    }

   const  GetUserList = (e)=>{
        e.preventDefault();
        getUserListf();

   }
   /*const  activeChat = (e)=>{
    e.preventDefault();
    socket.emit("join_room",user.userId);
    }/

    const handleSelectUser=(e,userActif)=>{
        e.preventDefault();
        setUseActif (userActif);
        setRoom(userActif.id);

    }
    useEffect(()=>{

        socket.on("receive_message",(data)=>{

            saveChate(data);
            setLastMessage(getChats());
            console.log("I have receive: ", lastMessages);
        })
        socket.on('disconnect',()=>{
            setConnected(false);
        });

    })
    getUserListf();

    return (
        < >

            <section >
            <div className="container py-5">

                <div className="row">

                <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">

                    <h5 className="font-weight-bold mb-3 text-center text-lg-start">Member</h5>

                    <div className="card">
                    <div className="card-body">

                        <ul className="list-unstyled mb-0">

                   { 

                        userListe.map((member,i)=>{

                          i++ // To avoid displey  

                          return (
                            <li key={i} className="p-2 border-bottom" >
                                <a href="#!" onClick={(e)=>handleSelectUser(e,member)} className="d-flex justify-content-between">
                                <div className="d-flex flex-row">
                                    <img src={"https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-"+i+".webp"} alt="avatar"
                                    className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60"/>
                                    <div className="pt-1">
                                    <p className="fw-bold mb-0">{member.userName}</p>
                                    </div>
                                </div>
                                {/*<div className="pt-1">
                                        <p className="small text-muted mb-1">Just now</p>
                                        <span className="badge bg-danger float-end">1</span>
                                    </div>/
                                }
                                </a>
                            </li> 
                          )  


                        })

                        
                    }

                        </ul>

                    </div>
                    </div>

                </div>

                <div className="col-md-6 col-lg-7 col-xl-8">

                    <ul className="list-unstyled">                    
                    {/**
                     * 
                     * Last messages
                     * 
                    /}
                    {

                    getChats().map((message,i)=>{
                        return(

                        <li key={i} className="d-flex justify-content-between mb-4">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp" alt="avatar"
                            className="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60"/>
                            <div className="card">
                            <div className="card-header d-flex justify-content-between p-3">
                                <p className="fw-bold mb-0">{message.room}</p>
                                <p className="text-muted small mb-0"><i className="far fa-clock"></i> 10 mins ago</p>
                            </div>
                            <div className="card-body">
                                <p className="mb-0">
                                {message.message}
                                </p>
                            </div>
                            </div>
                        </li>


                        )
                    })

                    

                    }

                    <li className="bg-white mb-3">
                        <div className="form-outline">
                        <textarea 
                        onChange={(e) => {
                            setMessage(e.target.value);
                        }}
                        className="form-control" id="textAreaExample2" rows="4"></textarea>
                        <label className="form-label" htmlFor="textAreaExample2">Message</label>
                        </div>
                    </li>
                    <button onClick={(e)=>sendMessage(e)} type="button" className="btn btn-info btn-rounded float-end">Send</button>
                   {/* <button onClick={(e)=>GetUserList(e)} type="button" className="btn btn-info me-2 btn-rounded float-end">list user</button>
                   <button onClick={(e)=>activeChat(e)} type="button" className="btn btn-info me-2 btn-rounded float-end">active Chat</button>/}

                    
                    </ul>

                </div>

                </div>

            </div>
            </section>
       
        </>
    );
}

export default Chat;*/
