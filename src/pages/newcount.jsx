import React, { useState } from 'react';
import Register from '../components/register';
import Verify from '../components/verify';
import Create from '../components/create';

const Newcount = () => {
    const [registrationPhase, setRegistrationPhase] = useState('register');

    const renderComponent = () => {
        switch (registrationPhase) {
            case 'register':
                return <Register />;
            case 'verify':
                return <Verify />;
            case 'create':
                return <Create />;
            default:
                return null;
        }
    };

    return (
        <div>
            {renderComponent()}
        </div>
    );
};

export default Newcount;