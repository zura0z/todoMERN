import "./Message.css";

const Message = ({ type, children, close }) => {
  const types = {
    info: { icon: "fas fa-info-circle", color: "#3242cd" },
    success: { icon: "far fa-check-circle", color: "#199d58" },
    error: { icon: "far fa-times-circle", color: "#cc0000" },
  };

  return (
    <div
      className="message-container"
      style={{
        borderImage: `linear-gradient(to top, ${types[type].color}, rgba(255, 255, 255, 0.25)) 10 100%`,
      }}
    >
      <div className="message">
        <div className="messages-icon-container">
          <i
            className={`messages-icon ${types[type].icon}`}
            style={{ color: types[type].color }}
          />
        </div>
        <div className="message-text-container">
          <p className="message-text">{children}</p>
        </div>
      </div>
      <div className="message-closeBtn-container">
        <button className="message-closeBtn" onClick={close}>
          CLOSE
        </button>
      </div>
    </div>
  );
};

Message.defaultProps = {
  type: "error",
};

export default Message;
