import Login from './component/login';
import SingUp from './component/singUp';
import Post from './component/post';
import Error from './component/error';
import Footer from './component/footer';
import Header from './component/header';
import 'bootstrap/dist/css/bootstrap.css';

import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import socket from './socket';

import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import { selectConvos, selectOnlineUsers, selectSelectedConvo, setConvos, setOnlineUsers } from './features/chatSlice';

function App() {

    const user = useSelector(selectUser)
    const onlineUsers = useSelector(selectOnlineUsers)
    const convos = useSelector(selectConvos)
    const selectedConvo = useSelector(selectSelectedConvo)

    const dispatch = useDispatch()

    
    useEffect(() => {
        function receiveMessage(messageDeets) /*: Message*/ {
            console.log('recieved a message', messageDeets)
            console.log('online users before update', onlineUsers)
            const previousConvos = [...convos]
            // find the conversation for this user
            const chatIndex = previousConvos.findIndex(c => c.id === messageDeets.from)
            console.log('chatIndex', chatIndex)
            if (chatIndex === -1) {
                // this is a new conversation started by the other user
                // create a new convo and move it to the top of the conversations
                console.log('online users during update', onlineUsers)
                const newConvo = {
                    id: messageDeets.from,
                    name: onlineUsers[messageDeets.from].userName, // lookup the username from list of online users
                    messages: [messageDeets],
                    totalUnread: 1
                }
                // add the new conversation at the top of the chat
                previousConvos.unshift(newConvo)
            } else {
                // if there's existing conversation
                const existingConvo = previousConvos[chatIndex]
                // add the message to it
                existingConvo.messages.push(messageDeets)
                // if this conversation is not open, count the new message as unread
                if (selectedConvo !== null && selectedConvo.id !== messageDeets.from) existingConvo.unreadCount += 1
                // push the conversation to the top of the list
                previousConvos.splice(chatIndex, 1)
                previousConvos.unshift(existingConvo)
            }
            // return previousConvos
            dispatch(setConvos(previousConvos))
        }
        function join() {
            // announce this user as "now online"
            socket.emit('join', { userId: user.userId, userName: user.userName })
        }
        function updateOnlineUsers(usersOnline) {
            dispatch(setOnlineUsers(usersOnline))
        }

        // listen for changes to online users
        socket.on('online-users', updateOnlineUsers)
        // listen for messages
        socket.on('message', receiveMessage)
        socket.on('connect', join)

        // connect when the user is logged in
        if(user) socket.connect()

        return () => {
            socket.off('online-usoers', updateOnlineUsers)
            socket.off('message', receiveMessage)
            socket.off('connect', join)
        }
    }, [convos, dispatch, onlineUsers, selectedConvo, user, user.userId, user.userName])


    return (
        <>
            <BrowserRouter>
                <Header />

                <Routes>

                    <Route path="*" element={<Error />} />
                    <Route path="/post" element={<Post />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/singUp" element={<SingUp />} />
                  
                </Routes>

                <Footer />
            </BrowserRouter>
            <ToastContainer />
        </>
    );
}

export default App;
