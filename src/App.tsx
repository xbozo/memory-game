import { useEffect, useState } from "react";
import * as C from "./App.styles";

import { GridItemType } from "./@types/GridItemType";
import { items } from "./data/items";
import { formatTimeElapsed } from "./utils/formatTimeElapsed";

import { Button } from "./components/Button";
import { GridItem } from "./components/GridItem";
import { InfoItem } from "./components/InfoItem";

import logoImage from "./assets/devmemory_logo.png";
import RestartIcon from "./assets/svgs/restart.svg";

const App = () => {
    const [playing, setPlaying] = useState<boolean>(false);
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [moveCount, setMoveCount] = useState<number>(0);
    const [shownCount, setShownCount] = useState<number>(0);
    const [gridItems, setGridItems] = useState<GridItemType[]>([]);

    useEffect(() => resetAndCreateGrid(), []);

    useEffect(() => {
        const timer = setInterval(() => {
            if (playing) {
                setTimeElapsed(timeElapsed + 1);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [playing, timeElapsed]);

    // Verificar se os abertos são iguais
    useEffect(() => {
        if (shownCount === 2) {
            let opened = gridItems.filter((item) => item.shown === true);

            if (opened.length === 2) {
                // Se eles são iguais, fazê-los permanentes (shown)
                if (opened[0].item === opened[1].item) {
                    let tempGrid = [...gridItems];
                    for (let i in tempGrid) {
                        if (tempGrid[i].shown) {
                            tempGrid[i].permanentShown = true;
                            tempGrid[i].shown = false;
                        }
                    }
                    setGridItems(tempGrid);
                    setShownCount(0);
                } else {
                    // Se eles não são iguais, fechá-los (shown)
                    setTimeout(() => {
                        let tempGrid = [...gridItems];
                        for (let i in tempGrid) {
                            tempGrid[i].shown = false;
                        }
                        setGridItems(tempGrid);
                        setShownCount(0);
                    }, 1000);
                }
                setMoveCount((moveCount) => moveCount + 1);
            }
        }
    }, [shownCount, gridItems]);

    // Verificar se o jogo acabou
    useEffect(() => {
        if (
            moveCount > 0 &&
            gridItems.every((item) => item.permanentShown === true)
        ) {
            setPlaying(false);
        }
    }, [moveCount, gridItems]);

    const resetAndCreateGrid = () => {
        // Resetar
        setTimeElapsed(0);
        setMoveCount(0);
        setShownCount(0);

        // Criar o grid vazio
        let tempGrid: GridItemType[] = [];
        for (let i = 0; i < items.length * 2; i++) {
            // items * 2 por que são 6 itens * 2 no jogo
            tempGrid.push({
                item: null,
                shown: false,
                permanentShown: false,
            });
        }

        // Preencher o Grid
        for (let w = 0; w < 2; w++) {
            // roda 2x o loop abaixo
            for (let i = 0; i < items.length; i++) {
                let pos = -1; // -1 por que 0 é uma posição do grid
                while (pos < 0 || tempGrid[pos].item !== null) {
                    // gera uma posição aleatória. o while é uma precaução pro item não se repetir
                    pos = Math.floor(Math.random() * (items.length * 2));
                }
                tempGrid[pos].item = i;
            }
        }

        // Jogar no state
        setGridItems(tempGrid);

        // Começar o jogo
        setPlaying(true);
    };

    const handleItemClick = (index: number) => {
        if (playing && index !== null && shownCount < 2) {
            // 2 por que é  processo de seleção das cartas do jogo
            let tempGrid = [...gridItems];

            if (
                tempGrid[index].permanentShown === false &&
                tempGrid[index].shown === false
            ) {
                tempGrid[index].shown = true;
                setShownCount(shownCount + 1);
            }

            setGridItems(tempGrid);
        }
    };

    return (
        <C.Container>
            <C.Info>
                <C.LogoLink href="">
                    <img src={logoImage} width="200" alt="" />
                </C.LogoLink>

                <C.InfoArea>
                    <InfoItem
                        label="Tempo"
                        value={formatTimeElapsed(timeElapsed)}
                    />
                    <InfoItem label="Movimentos" value={moveCount.toString()} />
                </C.InfoArea>

                <Button
                    label="Reiniciar"
                    icon={RestartIcon}
                    onClick={resetAndCreateGrid}
                />
            </C.Info>

            <C.GridArea>
                <C.Grid>
                    {gridItems.map((item, index) => (
                        <GridItem
                            key={index}
                            item={item}
                            onClick={() => handleItemClick(index)}
                        />
                    ))}
                </C.Grid>
            </C.GridArea>
        </C.Container>
    );
};

export default App;
