import { useRef, useState, useEffect } from "react";
import Phaser from "phaser";
import { PhaserGame } from "./game/PhaserGame";

function App() {
    const [canMoveSprite, setCanMoveSprite] = useState(true);
    const phaserRef = useRef();
    const [showInventory, setShowInventory] = useState(false);
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            console.log("Resizing...");
            const gameCanvas = document.getElementById("game");
            const inventoryMenu = document.getElementById("inventory-menu");
            if (gameCanvas && inventoryMenu) {
                const gameCanvasRect = gameCanvas.getBoundingClientRect();
                console.log("Game canvas rect:", gameCanvasRect);
                inventoryMenu.style.left = `${gameCanvasRect.left}px`;
                inventoryMenu.style.top = `${gameCanvasRect.top}px`;
                console.log(
                    "Inventory menu position:",
                    inventoryMenu.style.left,
                    inventoryMenu.style.top
                );
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
        setInventory(inventory.filter((human) => human.id !== humanId));
        localStorage.removeItem(
            inventory.findIndex((human) => human.id === humanId)
        );

        const updatedInventory = inventory.filter(
            (human) => human.id !== humanId
        );
        localStorage.setItem(
            "playerData",
            JSON.stringify({ inventory: updatedInventory })
        );
    };

    useEffect(() => {
        const playerData = JSON.parse(localStorage.getItem("playerData"));

        setInventory(playerData.inventory);
    }, [showInventory]);

    const currentScene = (scene) => {
        setCanMoveSprite(scene.scene.key !== "MainMenu");
    };

    return (
        <div id="app">
            <PhaserGame
                id="game"
                ref={phaserRef}
                currentActiveScene={currentScene}
            />
            {showInventory && (
                <div id="inventory-menu" style={{ position: "absolute" }}>
                    <h2>Inventory</h2>
                    <ul>
                        {inventory.map((human) => (
                            <div className="human-button-container">
                                <li key={human.id}>{human.name}</li>

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
