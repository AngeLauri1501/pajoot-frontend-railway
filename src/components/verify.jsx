import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import useStore from '../store';
import OtpInput from 'react-otp-input';
import Countdown from 'react-countdown';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate

const Verify = () => {
    const { userEmail, setUserEmail } = useStore();
    const [error, setError] = useState(null);
    const [otp, setOtp] = useState(0);
    const [targetDate, setTargetDate] = useState(Date.now() + 900000);
    const [lastResendTime, setLastResendTime] = useState(0);
    const navigate = useNavigate();  // Obtén la función de navegación

    // Función para formatear la salida del contador
    const formatTime = ({ minutes, seconds }) => {
        // Puedes personalizar el formato según tus necesidades
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Comprobar si hay un email en el estado global al cargar la página
    useEffect(() => {
        if (!userEmail) {
            // Si no hay un email, navegar automáticamente a /register
            navigate('/register');
        }
    }, [userEmail, navigate]);

    const handleTokenResend = async (event) => {

        event.preventDefault();

        const currentTime = Date.now();

        if (currentTime - lastResendTime < 60000) {
            setError('Por favor, espere antes de intentar reenviar el token nuevamente.');
            return;
        }

        try {
            // Realizar la petición POST a la API con el email
            const response = await fetch('https://pajoot-backend-railway-production.up.railway.app/api/send-verification-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                }),
            });

            // Verificar la respuesta de la API y manejarla según tus necesidades
            if (response.ok) {
                // La petición fue exitosa
                console.log('Email de verificación reenviado con éxito.');
                setTargetDate(Date.now() + 900000);
                setError('Codigo reenviado, por favor revise su correo electrónico.')
                setLastResendTime(currentTime);
            } else {
                // La petición no fue exitosa, manejar el error según tus necesidades
                console.error('Error al reenviar el email de verificación.');
            }
        } catch (error) {
            // Manejar errores de la petición (p.ej., error de red)
            console.error('Error en la petición POST:', error.message);
        }
    };

    const verifyToken = async () => {
        try {
            // Realizar la petición POST a la API con el email y el token
            const response = await fetch('https://pajoot-backend-railway-production.up.railway.app/api/verify-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                    verification_token: otp,
                }),
            });

            // Verificar la respuesta de la API y manejarla según tus necesidades
            if (response.ok) {
                // La petición fue exitosa
                console.log('Token verificado con éxito.');
            }
            else {
                // La petición no fue exitosa, manejar el error según tus necesidades
                throw new Error('Error verificando el token.');
            }
        } catch (error) {
            // Manejar errores de la petición (p.ej., error de red)
            throw error;
        }
    }

    const mutation = useMutation(verifyToken, {
        onSuccess: (data) => {
            console.log('Token verified successfully:');
            navigate('/create');
        },
        onError: (error) => {
            console.error('Error verifying token:', error);
            setError('Codigo incorrecto');
        },
    });

    const handleSubmit = (e) => {
        setError(null);
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <>
            <div className="entry-container new-register verify-register">
                <h1>Nuevo Usuario</h1>
                <div className="entry-credentials new-credentials">
                    <form className="form-login form-verify" onSubmit={handleSubmit}>
                        <p>Introduce el código de validación</p>
                        <div className="form-verify_countdown">
                            <Countdown date={targetDate} renderer={({ minutes, seconds }) => formatTime({ minutes, seconds })} />
                        </div>
                        <OtpInput
                            inputType='tel'
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderInput={(props) => <input {...props} />}
                            inputStyle={'form-verify_input'}
                            required
                        />
                        {error && <p className="error-message">{error}</p>}
                        <button type='submit' className="form-login_button form-verify_button" disabled={mutation.isLoading}>
                            {mutation.isLoading ? 'Validando...' : 'Validar'}
                        </button>
                    </form>
                </div>
                <p className="register-text">No ha llegado el código?</p><br /><a href="" onClick={handleTokenResend} className="register-new">Volver a enviar</a>
            </div>
        </>
    );
};

export default Verify;
