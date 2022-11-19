import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faThumbsUp,
    faThumbsDown,
} from '@fortawesome/free-solid-svg-icons';
import { Modal, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
    creatPost,
    likePost,
    getApiPosts,
    deletPost,
    updatePost,
} from '../service/api.service';
import { getPostUserName } from '../service/posts.service';
import { useDispatch, useSelector } from 'react-redux';
import { savePosts, selectPosts } from '../features/postSlice';
import { selectUser, selectLoggedIn } from '../features/userSlice';
import { notify } from '../service/notification';
import Spinner from '../component/spinner';
import { getPost } from '../service/auth.service';
import { useCallback } from 'react';

function App() {
    const imgUrl='https://res.cloudinary.com/dkdwhd7hl/image/upload/v14858684/Groupomania/posts/post_';
    //v14858684
  //       url: 'http://res.cloudinary.com/dkdwhd7hl/image/upload/v1668873640/Groupomania/posts/post_6378edc1cb3ed1186ba45188.png',
  //secure_url: 'https://res.cloudinary.com/dkdwhd7hl/image/upload/v1668873640/Groupomania/posts/post_6378edc1cb3ed1186ba45188.png',
    
    const [show, setShow] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const [postText, setPostText] = useState('');
    const [activePost, setActivePost] = useState({});
    const [appChange, setAppChange] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [file, setFile] = useState(null);

    const handleClose = () => {
        cleanConstan();
        setShow(false);
    };
    const handleShow = () => {
        setShow(true);
    };

    const handleCloseUpdateModel = () => {
        cleanConstan();
        setShowUpdateModal(false);
    };
    const handleShowUpdateModel = (e, post) => {
        setActivePost(post);
        setPostText(post.text);
        setShowUpdateModal(true);
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const posts = useSelector(selectPosts);
    //const loggedIn = useSelector(selectLoggedIn);

    const selectorLoggedIn = useSelector(selectLoggedIn);
    const [loggedIn, setLoggedIn] = useState(selectorLoggedIn);

    const loadPosts = useCallback(() => {
        setLoaded(true);
        getApiPosts(user.token)
            .then((posts) => {
                return getPostUserName(posts, user.token);
            })
            
            .then(() => {dispatch( savePosts(getPost()));})
            .catch((e) => console.log(e))
            .finally((rep) => setLoaded(false));
    },[]);

    const cleanConstan = () => {
        setFile(null);
        setActivePost('');
        setPostText('');
    };

    const fileHandler = (event) => {
        setFile(event.target.files[0]);
    };

    const handlCreatePost = (e) => {
        e.preventDefault();
        handleClose();

        setLoaded(true);

        creatPost(user.token, postText, file)
            .catch((e) => console.log(e))
            .finally(() => {
                handleClose();
                setLoaded(false);
                setAppChange(!appChange);
                notify(true, 'Votre poste a été ajouté');
            });
        cleanConstan();
    };

    const update = (e, post) => {
        e.preventDefault();

        setLoaded(true);

        user.userId === post.userId || user.isAdmin
            ? updatePost(user.token, postText, file, activePost._id)
                  .catch((e) => {
                      console.log(e);
                  })
                  .finally(() => {
                      setLoaded(true);
                      setAppChange(!appChange);
                      notify(true, 'Votre poste a été modifié');
                  })
            : notify(false, 'Vous ne pouvez pas modifier ce poste');
        cleanConstan();
        handleCloseUpdateModel();
    };
    const handledelete = (e, post) => {
        e.preventDefault();

        if (user.userId === post.userId || user.isAdmin) {
            setLoaded(true);
            deletPost(user, post)
                .catch((e) => console.log(e))
                .finally(() => {
                    setLoaded(true);
                    setAppChange(!appChange);
                    notify(true, 'Votre poste a été supprimé');
                });
        } else {
            notify(false, 'Vous ne pouvez pas supprimer ce poste');
        }
    };
    const handleLike = (e, post) => {
        e.preventDefault();
        
        setLoaded(true);

        likePost(user, post)
            .catch((e) => console.log(e))
            .finally(() => {
                setLoaded(true);
                setAppChange(!appChange);
            });
    };
    useEffect(() => {
        if (!loggedIn) {
            navigate('/');
        }
        loadPosts();
    }, [ selectorLoggedIn,appChange]);

    return (
        <div >
            <div className="shadow p-3 mb-5 bg-body  rounded border border-2 postCard">
                <div>
                <label className='text-black'>Créer une publication
                    <input
                        className="form-control form-control-sm "
                        type="text"
                        placeholder=""
                        onClick={handleShow}                        
                    />
                    </label>

                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <form onSubmit={(e) => handlCreatePost(e)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Créer une publication</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Control
                                    as="textarea"
                                    required
                                    type="text"
                                    className="form-control"
                                    id="message-text"
                                    placeholder="Entre votre text ici"
                                    rows="6"
                                    onChange={(e) => {
                                        setPostText(e.target.value);
                                    }}
                                    value={postText}
                                />
                            </Modal.Body>
                            <Modal.Footer>
                                <Form.Control
                                    type="file"
                                    size="lg"
                                    onChange={fileHandler}
                                />
                                <Button
                                    variant="secondary"
                                    onClick={handleClose}
                                >
                                    fermer
                                </Button>
                                <Button variant="primary" type="submit">
                                    Publier
                                </Button>
                            </Modal.Footer>
                        </form>
                    </Modal>
                </div>
            </div>
            <>
                {loaded ? (
                    <Spinner />
                ) : (
                    ''
                )}

                {posts.map((post) => {
                    return (
                        <div
                            key={post._id}
                            className="shadow p-3 mb-5 bg-body rounded border border-2 postCard"
                        >
                            <div className="postCardHealder">
                                <h2 className="overflow-hidden  postCardTitle">
                                    {post.userName?post.userName : "Anonyme"}
                                </h2>
                                <p className="postDate ">
                                    {' '}
                                    Le {post.createOne.substring(0, 10)}
                                </p>
                            </div>
                           { console.log("post.imgUrl: ",post.imageUrl)}
                            <img src={ imgUrl+post._id +'.'+post.imageUrl} className="" alt={post.text.substring(0,5)} />
                            <div className="cardBody">
                                <p className="cardText">{post.text}</p>
                                <div className="cardButton">
                                    
                                        <div className="btn overflow-hidden "  onClick={(e) => handleLike(e, post)}>
                                            <span >
                                                {post.likes}
                                            </span>

                                            {post.usersLiked.includes(
                                                user.userId
                                            ) ? (
                                                <FontAwesomeIcon
                                                    icon={faThumbsDown}
                                                    size="lg"
                                                    pull="left"
                                                    style={{ color: 'red' }}
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faThumbsUp}
                                                    size="lg"
                                                    pull="left"
                                                    style={{ color: 'green' }}
                                                />
                                            )}
                                        </div>

                                    <button
                                        type="button"
                                        className="btn btn-light overflow-hidden"
                                        disabled={
                                            post.userId === user.userId ||
                                            user.isAdmin
                                                ? false
                                                : true
                                        }
                                        onClick={(e) =>
                                            handleShowUpdateModel(e, post)
                                        }
                                    >
                                        Modifier
                                        
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-light overflow-hidden"
                                        disabled={
                                            post.userId === user.userId ||
                                            user.isAdmin
                                                ? false
                                                : true
                                        }
                                        onClick={(e) => handledelete(e, post)}
                                    >
                                       Supprimer
                                    </button>
                                </div>
                            </div>
                            
                            <Modal
                                show={showUpdateModal}
                                onHide={handleCloseUpdateModel}
                                backdrop="static"
                                keyboard={false}
                            >
                                <form onSubmit={(e) => update(e, activePost)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>
                                            Modifier la publication
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form.Control
                                            as="textarea"
                                            required
                                            type="text"
                                            className="form-control"
                                            id="message-text"
                                            placeholder="Entre votre text ici"
                                            rows="6"
                                            onChange={(e) => {
                                                setPostText(e.target.value);
                                            }}
                                            value={postText}
                                        />
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Form.Control
                                            type="file"
                                            size="lg"
                                            onChange={fileHandler}
                                        />
                                        <Button
                                            variant="secondary"
                                            onClick={handleCloseUpdateModel}
                                        >
                                            fermer
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            Modifier
                                        </Button>
                                    </Modal.Footer>
                                </form>
                            </Modal>
                        </div>
                    );
                })}
            </>
        </div>
    );
}

export default App;
