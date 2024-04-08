import React from 'react';

    const avatarsArray = [
        './assets/avatar/gato-1.png',
        './assets/avatar/gato-2.png',
        './assets/avatar/gato-3.png',
        './assets/avatar/gato-4.png',
        './assets/avatar/gato-5.png',
        './assets/avatar/gato-6.png',
        './assets/avatar/gato-7.png',
        './assets/avatar/gato-8.png',
        './assets/avatar/gato-9.png',
        './assets/avatar/gato-10.png',
        './assets/avatar/gato-11.png',
        './assets/avatar/gato-12.png',
        './assets/avatar/gato-13.png',
        './assets/avatar/gato-14.png',
    ];
    const ProfileAvatar = ({ avatars, onSelect, selectedAvatar }) => {
    
    if(!avatars) {
        return null;
    }

    return (
        <div className="avatar-selector">
            {avatars.map((avatar, index) => (
                <img
                    key={index}
                    src={avatar}
                    alt={`Avatar-${index}`}
                    className={selectedAvatar === avatar ? 'selected-image' : ''}
                    onClick={() => onSelect(avatar)}
                />
            ))}
        </div>
    );
};
export { avatarsArray };
export default ProfileAvatar;