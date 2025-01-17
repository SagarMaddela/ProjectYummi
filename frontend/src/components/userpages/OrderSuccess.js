import React from "react";
import { useSpring, animated } from "@react-spring/web";

const OrderSuccess2 = () => {
    const fadeInStyles = useSpring({
        from: { opacity: 0, transform: "translateY(-50px)" },
        to: { opacity: 1, transform: "translateY(0)" },
        delay: 200,
    });

    const scaleStyles = useSpring({
        from: { scale: 0 },
        to: { scale: 1 },
        delay: 500,
    });

    return (
        <animated.div style={{ ...fadeInStyles, textAlign: "center", padding: "30vh", background: "#f5f5f5", height: "100vh" }}>
            <animated.h1 style={{ color: "orangered", fontSize: "2rem", ...fadeInStyles }}>
                🎉 Order Placed Successfully!
            </animated.h1>
            <animated.div
                style={{
                    ...scaleStyles,
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "orangered",
                    margin: "20px auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <span style={{ fontSize: "2rem", color: "white" }}>✔</span>
            </animated.div>
            <button
                onClick={() => window.location.href = "/userlayout/userhomepage"}
                style={{
                    marginTop: "30px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    border: "none",
                    borderRadius: "5px",
                    background: "orangered",
                    color: "white",
                    cursor: "pointer",
                }}
            >
                Go to Homepage
            </button>
        </animated.div>
    );
};

export default OrderSuccess2;