import { useRef, useState, useEffect } from "react";
import { TestPhaserGame } from "./TestPhaserGame";


function App() {
    const [canMoveSprite, setCanMoveSprite] = useState(true);
    const phaserRef = useRef();
    const [showInventory, setShowInventory] = useState(false);
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            const gameCanvas = document.getElementById("game");
            const inventoryMenu = document.getElementById("inventory-menu");
            if (gameCanvas && inventoryMenu) {
                const gameCanvasRect = gameCanvas.getBoundingClientRect();
                inventoryMenu.style.left = `${gameCanvasRect.left}px`;
                inventoryMenu.style.top = `${gameCanvasRect.top}px`;
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleInventory = () => {
        setShowInventory(!showInventory);
    };

    const removeHumanFromInventory = (humanId) => {
        const updatedInventory = inventory.filter(
            (human) => human.id !== humanId
        );
        setInventory(updatedInventory);
        localStorage.setItem(
            "playerData",
            JSON.stringify({ inventory: updatedInventory })
        );
    };

    useEffect(() => {
        const playerData = JSON.parse(localStorage.getItem("playerData"));
        if (playerData && playerData.inventory) {
            setInventory(playerData.inventory);
        } else {
            setInventory([]);
        }
    }, [showInventory]);

    const currentScene = (scene) => {
        setCanMoveSprite(scene.scene.key !== "MainMenu");
    };

    return (
        <div id="app">
            <TestPhaserGame
                id="game"
                ref={phaserRef}
                currentActiveScene={currentScene}
            />
            {showInventory && (
                <div id="inventory-menu" style={{ position: "absolute" }}>
                    <h2>Inventory</h2>
                    <ul>
                        {inventory.map((human) => (
                            <div
                                key={human.id}
                                className="human-button-container"
                            >
                                <li>{human.name}</li>
                                <button
                                    className="button remove-button"
                                    onClick={() =>
                                        removeHumanFromInventory(human.id)
                                    }
                                >
                                    Release
                                </button>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
            <div className="manage-humans">
                <button className="button" onClick={toggleInventory}>
                    Manage Humans
                </button>
            </div>
        </div>
    );
}

export default App;
