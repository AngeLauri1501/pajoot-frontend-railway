import React, { useState, useEffect } from 'react';
import useStore from '../store';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import app from '../../firebaseConfig';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import ProfileAvatar, { avatarsArray } from '../components/profileAvatar';

const Profile = () => {
    const {userLogged, setUserLogged} = useStore();
    const [user, setUser] = useState(userLogged ? userLogged.displayName || '' : '');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const auth = getAuth(app);
    const [customAvatar, setCustomAvatar] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState(userLogged ? userLogged.photoURL || null : null);
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);

    // Comprobar si hay un email en el estado global al cargar la página
    useEffect(() => {
        if (userLogged) {
            setUser(userLogged.displayName || '');
        };
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown')) {
                setDropdownOpen(false);
            }
        };

        // Agregar event listener al montar el componente
        document.addEventListener('click', handleClickOutside);

        // Limpiar event listener al desmontar el componente
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };

    }, [userLogged, navigate]);

    const mutation = useMutation(async () => {
        let foto = userLogged.photoURL;
    
        // Si hay una imagen personalizada seleccionada
        if (customAvatar) {
            // Crear formData para enviar la imagen al backend
            const formData = new FormData();
            formData.append('image', customAvatar);
            formData.append('email', userLogged.email);
    
            // Hacer la petición al backend para subir la imagen a AWS y obtener la URL
            const response = await fetch('https://pajoot-backend-railway-production.up.railway.app/api/upload-photo', {
                method: 'POST',
                body: formData,
                // Asegúrate de configurar los encabezados adecuados según las necesidades de tu backend
            });
    
            if (response.ok) {
                // Extraer la URL de la respuesta del backend
                const data = await response.json();
                foto = data.url; // Suponiendo que el campo que contiene la URL es "url"
            } else {
                throw new Error('Error al subir la imagen personalizada');
            }
        }
    
        // Actualizar el nombre de usuario y la foto de perfil en Firebase
        return Promise.all([
            updateProfile(auth.currentUser, { displayName: user, photoURL: foto }),
            setUserLogged({ ...userLogged, displayName: user, photoURL: foto })
        ]);
    });

    const handleInputChange = (e) => {
        setUser(e.currentTarget.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate();
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        setCustomAvatar(null); // Restablecer customAvatar a null
    };
    
    const handleCustomAvatarChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(null); // Restablecer profileImage a null
        setCustomAvatar(file);
        console.log('Custom Avatar:', customAvatar);
    };

    const handleChooseAvatar = () => {
        setShowAvatarSelector(!showAvatarSelector);
    };
    const handleSaveSelection = (selected) => {
        // Actualiza la imagen de perfil del usuario loggeado
        if (typeof selected === 'string') {
            // Si es una URL, simplemente actualiza el estado
            setSelectedAvatar(selected);
        } else {
            // Si es un archivo, crea una URL local y actualiza el estado
            const avatarURL = URL.createObjectURL(selected);
            setSelectedAvatar(avatarURL);
        }
    };
    const handleSaveButtonClick = () => {
        // Actualiza la imagen de perfil del usuario loggeado al hacer clic en "Guardar"
        if (selectedAvatar) {
            updateProfile(auth.currentUser, { photoURL: selectedAvatar })
                .then(() => {
                    // Actualiza el estado global con la nueva photoURL
                    setUserLogged({ ...userLogged, photoURL: selectedAvatar });
                })
                .catch((error) => {
                    setError(error.message);
                });
        }
        setShowAvatarSelector(false);
        document.getElementById('customimgimput').value = null; // Limpiar el valor del input (para poder subir la misma imagen varias veces)
        setCustomAvatar(null);

    };

    const handleLogout = () => {
        // Cerrar sesión
        console.log('Cerrando sesión..');

        auth.signOut();
        setUserLogged(null);
        
        navigate('/');
    };

    return (
        <>
        
            <div className='menu-top'>
                <a href='/'>
                    <img src='./assets/img/logo-pajoot.png' className="logo-pajoot" alt="Logo-Pajoot" />
                </a>
                {userLogged && (
                <div className='user-info'>
                    <div className={`dropdown ${dropdownOpen ? 'active' : ''}`} onClick={toggleDropdown}>
                        <button className='dropbtn'>
                            <p id='user-display-name' className='login-link'>{userLogged.displayName}</p>
                            <img src={userLogged.photoURL === null ? './assets/img/usuario-de-perfil.png' : userLogged.photoURL} className='user-avatar' alt='Avatar-Usuario' />
                        </button>
                        <div className='dropdown-content'>
                            <div className='triangle'></div>
                            <a href='#'>Editar Perfil</a>
                            <a href='' onClick={handleLogout}>Cerrar Sesión</a>
                        </div>
                    </div>
                </div>
                )}
            </div>
            <div className="entry-container new-register create-register">
                <h1>Perfil</h1>
                {userLogged && (
                <div className="entry-credentials new-credentials">
                    <form className="form-login form-create" onSubmit={handleSubmit}>
                        <p>Nombre</p>
                        <input type='text' className="form-login_input" name='nombre' placeholder="Nombre" maxLength={20} value={user} onChange={handleInputChange} required/>
                        <p>Imagen</p>
                        {customAvatar === null ? (
                            <img 
                                src={userLogged.photoURL === null ? './assets/img/usuario-de-perfil.png' : userLogged.photoURL} 
                                onChange={handleImageChange} 
                                className='user-avatar' 
                                alt='Avatar-Usuario' 
                            />
                        ) : (
                            <img 
                                src={URL.createObjectURL(customAvatar)} 
                                className='user-avatar' 
                                alt="Profile" 
                            />
                        )}
                        <button type='button' className='form-avatar_button' onClick={handleChooseAvatar}>Elegir otro</button>
                        <div className='load-file'>
                        <input type="file" accept="image/*" onChange={handleCustomAvatarChange} id='customimgimput'/>
                        </div>
                        <input type='submit' className="form-login_button" value={mutation.isLoading ? 'Guardando...' : 'Guardar'} disabled={mutation.isLoading}/>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                    {showAvatarSelector && (
                        <div className="avatar-selector-container">
                            <div className='avatar-images'>
                                <ProfileAvatar avatars={avatarsArray} onSelect={handleSaveSelection} selectedAvatar={selectedAvatar}/>
                            </div>
                            <button className="save-avatar-button" onClick={handleSaveButtonClick}>Guardar selección</button>
                        </div>
                    )}
                </div>
                )}
            </div>
        </>
    );
};

export default Profile;
