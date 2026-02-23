
const Spinner = ({ fullScreen = false }) => {
    return (
        <div className={fullScreen ? "spinner-overlay" : "spinner-container"}>
            <div className="custom-spinner"></div>
        </div>
    );
};

export default Spinner;