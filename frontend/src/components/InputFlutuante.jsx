import React from 'react';

const InputFlutuante = ({
    type,
    id,
    rotulo,
    valor,
    aoMudar,
    erro,
    ...props
}) => {
    return (
        <div className="floating-input-group">
            <input
                id={id}
                type={type}
                className={`floating-input ${erro ? 'input-error' : ''}`}
                placeholder=" "
                value={valor}
                onChange={aoMudar}
                {...props}
            />
            <label className="floating-label" htmlFor={id}>
                {rotulo}
            </label>
            {erro && <span className="error-message">{erro}</span>}
        </div>
    );
};

export default InputFlutuante;
