import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import useStore from '../store';
import { useNavigate } from 'react-router-dom';

const Create = () => {
    const { userEmail, setUserEmail, verifiedEmail, setVerifiedEmail, userLogged, setUserLogged} = useStore();
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();  

        // Comprobar si hay un email en el estado global al cargar la página
        useEffect(() => {
            if (userEmail) {
                setVerifiedEmail(userEmail);
                setUserEmail(null);
            }
            else{
                if (!verifiedEmail) {
                    // Si el email ya fue verificado, navegar automáticamente a /register
                    navigate('/register');
                }
            }
        }, [userEmail, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        console.log(file);
    };

    const createUser = async () => {
        if (password !== password2) {
            throw new Error('Las contraseñas no coinciden');
        }

        let formdata = new FormData();
        if (profileImage){
            formdata.append('image', profileImage);
        }
        formdata.append('email', verifiedEmail);
        formdata.append('user', user);
        formdata.append('password', password);

        try {
            console.log(formdata);
            const response = await fetch('https://pajoot-backend-railway-production.up.railway.app/api/create-user', {
                method: 'POST',
                body: formdata,
            });

            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.error || 'Error creating user');
            }
        } catch (error) {
            throw error;
        }
    };

    const mutation = useMutation(createUser, {
        onSuccess: (data) => {
            console.log('User created successfully:', data);
            navigate('/');
        },
        onError: (error) => {
            console.error('Error creating user:', error);
            setError(error.message);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <>
            <div className="entry-container new-register create-register">
                <h1>Nuevo Usuario</h1>
                <div className="entry-credentials new-credentials">
                    <form className="form-login form-create" onSubmit={handleSubmit}>
                        <p>Introduce un nombre de usuario</p>
                        <input type='text' onChange={e => setUser(e.currentTarget.value)} className="form-login_input" name='correu' placeholder="Nombre" required />
                        <p>Elige una contraseña</p>
                        <p className="regex-contr">(mínimo 8 caracteres, con 1 dígito y 1 mayúscula)</p>
                        <input type="password" onChange={e => setPassword(e.currentTarget.value)} className="form-login_input" name="contrasenya" placeholder="Contraseña" pattern="^(?=.*[A-Z])(?=.*\d).{8,}$" required />
                        <p>Repite la contraseña</p>
                        <input type="password" onChange={e => setPassword2(e.currentTarget.value)} className="form-login_input" name="contrasenya" placeholder="Contraseña" pattern="^(?=.*[A-Z])(?=.*\d).{8,}$" required />
                        <p>Añade una imagen</p>
                        <div className='load-file'>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        </div>
                        {profileImage && (
                            <img src={URL.createObjectURL(profileImage)} alt="Profile" style={{ maxHeight: '140px' }} />
                        )}
                        <input type='submit' className="form-login_button" value={mutation.isLoading ? 'Creando...' : 'Crear usuario'} disabled={mutation.isLoading} />
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
            </div>
        </>
    );
};

export default Create;
