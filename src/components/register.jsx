import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom'; 
import useStore from '../store';

const Register = () => {
    const { userEmail, setUserEmail } = useStore();
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setUserEmail(e.target.value);
        setError(null); // Limpiar el mensaje de error cuando el correo se actualiza
    };

    const sendVerificationEmail = async () => {
        try {
            // Hacer la petición POST a localhost:3001/api/send-verification-email
            const response = await fetch('https://pajoot-backend-railway-production.up.railway.app/api/send-verification-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Si la respuesta es exitosa, retornar los datos
                return data;
            } else {
                // Si hay un error en la respuesta, manejarlo
                throw new Error(data.error || 'Error sending verification email');
            }
        } catch (error) {
            // Manejar errores de red u otros errores
            if (error.message.includes('Email is already registered')) {
                setError('El correo electrónico ya está registrado');
            } else {
                setError('Error enviando el correo de verificación');
            }
            throw error;
        }
    };

    const mutation = useMutation(sendVerificationEmail, {
        onSuccess: (data) => {
            console.log('Verification email sent successfully:', data);
            navigate('/verify');
        },
        onError: (error) => {
            console.error('Error sending verification email:', error);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <>
            <div className="entry-container new-register">
                <h1>Nuevo Usuario</h1>
                <div className="entry-credentials new-credentials">
                    <form onSubmit={handleSubmit} className="form-login">
                        <p>Introduce un correo electrónico.<br />Te enviaremos un código de validación.</p>
                        <input
                            type='email'
                            value={userEmail || ''}
                            onChange={handleEmailChange}
                            className="form-login_input form-register_input"
                            name='correu'
                            placeholder="Email"
                            required
                        />
                        {error && <p className="error-message">{error}</p>}
                        <button type='submit' className="form-login_button form-register_button" disabled={mutation.isLoading}>
                            {mutation.isLoading ? 'Enviando...' : 'Enviar código'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
