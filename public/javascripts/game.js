document.addEventListener('DOMContentLoaded', function () {
    const gameBoard = document.getElementById('game-board');
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', function () {
            startGame();
        });
    }
    openPopup();
    function openPopup() {
        const popup = document.getElementById('player-popup');
        popup.style.display = 'block';
    }
    
    
    function closePopup() {
        const popup = document.getElementById('player-popup');
        popup.style.display = 'none';
    }
    
    
    function startGame() {
        player1Name = document.getElementById('player1').value;
        player2Name = document.getElementById('player2').value;
        player3Name = document.getElementById('player3').value;
        player4Name = document.getElementById('player4').value;
        
        playeramount = filledPlayer();

        initializeGame();
    
    
        console.log('Spieler 1:', player1Name);
        console.log('Spieler 2:', player2Name);
        console.log('Spieler 3:', player3Name);
        console.log('Spieler 4:', player4Name);
    
    
        closePopup();
    }
    
    var player1Name;
    var player2Name;
    var player3Name;
    var player4Name;

    const fieldList = [
        [0, 4],[1, 4],[2, 4],[3, 4],[4, 4],[4, 3],[4, 2],[4, 1],[4, 0],[5, 0],[6, 0],[6, 1],[6, 2],[6, 3],[6, 4],[7, 4],[8, 4],[9, 4],[10, 4],[10, 5],[10, 6],[9, 6],[8, 6],[7, 6],[6, 6],[6, 7],[6, 8],[6, 9],[6, 10],[5, 10],[4, 10],[4, 9],[4, 8],[4, 7],[4, 6],[3, 6],[2, 6],[1, 6],[0, 6],[0, 5],
      ];
    const houseList = [
        [0 ,0],[1 ,0],[0 ,1],[1 ,1], [9 ,0],[10 ,0],[9 ,1],[10 ,1], [0 ,9],[1 ,9],[0 ,10],[1 ,10], [9 ,9],[10 ,9],[9 ,10],[10 ,10],
    ];
    var pieceList = [
        [0 ,0],[1 ,0],[0 ,1],[1 ,1], [9 ,0],[10 ,0],[9 ,1],[10 ,1], [0 ,9],[1 ,9],[0 ,10],[1 ,10], [9 ,9],[10 ,9],[9 ,10],[10 ,10],
    ];
    const goalList = [
        [1 ,5],[2 ,5],[3 ,5],[4 ,5], [5 ,1],[5 ,2],[5 ,3],[5 ,4], [5 ,9],[5 ,8],[5 ,7],[5 ,6], [9 ,5],[8 ,5],[7 ,5],[6 ,5],
    ];
    const startingTileList = [
        [0, 4], [6, 0], [4, 10], [10, 6]
    ]
    const playerColors = ['yellow', 'green','blue','red'];
    var piecesOut = [0, 0, 0, 0];
    var playerturn = 0;
    var rolledDice = 1;
    var playeramount = 0;
    var timesPlayerRolled = 0;
    function adjustGameBoard(playeramount){
        if(playeramount < 2 || playeramount > 4){
            console.error("Ungültige Spieleranzahl. Die Spieleranzahl muss zwischen 2 und 4 Spielern liegen.")
        }
        const fieldsToDelete = (4 - playeramount) * 4;
        houseList.splice(-fieldsToDelete, fieldsToDelete);
    }

    function filledPlayer(){
        filledPlayer = 0;

        if(player1Name.trim() !== ''){
            filledPlayer++;
        }
        if(player2Name.trim() !== ''){
            filledPlayer++;
        }
        if(player3Name.trim() !== ''){
            filledPlayer++;
        }
        if(player4Name.trim() !== ''){
            filledPlayer++;
        }
        return filledPlayer;
    }
    var timesPlayerRolled = 0;

    function initializeGame() {
        createGameBoard();
        const gameInterface = createGameInterface();
        gameBoard.parentElement.appendChild(gameInterface);

        adjustGameBoard(playeramount);

        addStartPlayerCircles(houseList);
    }

    function addStartPlayerCircles(list) {  
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            const firstValue = element[0];
            const secondValue = element[1];
            const cell = findCellByRowAndColumn(firstValue, secondValue);

            if(i % 4 === 0 && i != 0) {
                playerturn = playerturn + 1;
            }
                addPlayerCircle(cell, playerColors[playerturn]);
        }
        playerturn = 0;
    }

    function createCell(className, row, column) {
        const cell = document.createElement('div');
        cell.className = className;
        cell.setAttribute('data-row', row);
        cell.setAttribute('data-column', column);

        cell.addEventListener('click', function () {
            if(!cell.classList.contains('empty')) {
                isMovingPieceOutAllowed(cell);
                movePiece(cell);
            }
        });
        return cell;
    }

    function updateCoordinateInList(list, x, y, newX, newY) {
        for (let i = 0; i < list.length; i++) {
            const coordinates = list[i];
            const pieceX = coordinates[0];
            const pieceY = coordinates[1];
    
            if (pieceX === x && pieceY === y) {
                list[i] = [newX, newY];
                return;
            }
        }
        console.error('Coordinates not found');
    }

    function updateCoordinatesInListByIdx(list, newx, newY) {
        list[i] = [newX, newY];
    }

    function findIndexFromList(list, x, y) {
        for (let i = 0; i < list.length; i++) {
            const coordinates = list[i];
            const pieceX = coordinates[0];
            const pieceY = coordinates[1];
            
            if(pieceX === x && pieceY === y) {
                return i;
            }
        }
    }

    function isMovingPieceOutAllowed(cell) {
        if(rolledDice != 6) {
            return;
        }
        const startingTileX = startingTileList[playerturn][0];
        const startingTileY = startingTileList[playerturn][1];
        const startingTile = findCellByRowAndColumn(startingTileX, startingTileY);
        if(cell.classList.contains('housep1') && playerturn === 0) {
            movePieceOut(cell, startingTile, startingTileX, startingTileY);
        }
        if(cell.classList.contains('housep2') && playerturn === 1) {
            movePieceOut(cell, startingTile, startingTileX, startingTileY);
        }
        if(cell.classList.contains('housep3') && playerturn === 2) {
            movePieceOut(cell, startingTile, startingTileX, startingTileY);
        }
        if(cell.classList.contains('housep4') && playerturn === 3) {
            movePieceOut(cell, startingTile, startingTileX, startingTileY);
        }
    }

    function movePieceOut(cell, startingTile, startingTileX, startingTileY) {
        removePlayerCircle(cell);
        addPlayerCircle(startingTile, playerColors[playerturn]);

        const cellCoordinates = getCoordinatesFromCell(cell);
        const cellX = cellCoordinates[0];
        const cellY = cellCoordinates[1];
        updateCoordinateInList(pieceList, cellX, cellY, startingTileX, startingTileY);
    }

    function movePiece(cell) {
        if(cell.classList.contains('housep1') || cell.classList.contains('housep2') || cell.classList.contains('housep3') || cell.classList.contains('housep4')) {
            return false;
        }
        const pieceColor = getColorAtCell(cell)
        const cellCoordinates = getCoordinatesFromCell(cell);
        const cellX = cellCoordinates[0];
        const cellY = cellCoordinates[1];
        const piecePosIdx = findIndexFromList(pieceList, cellX, cellY);
        const currentPlayerColor = playerColors[playerturn];
        if(pieceColor === currentPlayerColor) {
            const newPos = updateToNewPosition(piecePosIdx, cellX, cellY);
            console.log(newPos);
            const newPosX = newPos[0];
            const newPosY = newPos[1];
            removePlayerCircle(cell);
            addPlayerCircle(findCellByRowAndColumn(newPosX, newPosY), currentPlayerColor);

            if(rolledDice != 6) {
                updatePlayerturn();
            }
        }
        
    }

    function updatePlayerturn() {
        if(playerturn === playeramount-1) {
            playerturn = 0;
        } else {
            playerturn = playerturn + 1;
        }
    }

    function updateToNewPosition(piecePosIdx, cellX, cellY) {
        
        const fieldIdx = findIndexFromList(fieldList, cellX, cellY);
        const newPos = fieldList[fieldIdx + rolledDice];
        pieceList[piecePosIdx] = newPos;
        return newPos;
    }

    function getColorAtCell(cell) {
        const playerCircle = cell.querySelector('.player-circle');
        if (playerCircle) {
            return playerCircle.style.backgroundColor;
        }
        return null;
    }

    function isOnePieceOut() {
        playerIdx = playerturn * 4;
        for (let i = playerIdx; i < playerIdx + 4; i++) {
            piecePosX = pieceList[i][0];
            piecePosY = pieceList[i][1];
            housePosX = houseList[i][0];
            housePosY = houseList[i][1];
            //console.log(piecePosX + "   " + housePosX + "   " + piecePosY + "   " + housePosY);
            if(!(piecePosX === housePosX && piecePosY === housePosY)) {
                return true;
            }
        }
        return false;
    }

    function changeTextFieldText(newText) {
        const textField = document.querySelector('.informationBoard');
        if (textField) {
            textField.textContent = newText;
        } else {
            console.error('Text field not found.');
        }
    }

    function createDice() {
        const dice = document.createElement('div');
        dice.className = 'dice';
        const diceImage = document.createElement('img');
        diceImage.src = '/assets/images/one.png';
        diceImage.className = 'dice-image';

        dice.appendChild(diceImage);

        dice.addEventListener('click', function () {
            rollDice();
        });

        return dice;
    }

    function createMagicDice() {
        const dice = document.createElement('div');
        dice.className = 'dice';
        const diceImage = document.createElement('img');
        diceImage.src = '/assets/images/magicDice.png';
        diceImage.className = 'dice-image';

        dice.appendChild(diceImage);

        dice.addEventListener('click', function () {
            rollMagicDice();
        });

        return dice;
    }

    function rollMagicDice() {
        rolledDice = 6;
        timesPlayerRolled = 0;
        changeTextFieldText("Player " + (playerturn + 1) + " rolled a 6. It's your turn again!");
    }


    function kickOtherPieceOut(cell) {
        
        //check if x and y is already occupied
        if(!(cell.querySelector('.player-circle') !== null)) {
            const color = getColorAtCell(cell);
            //if so check if it is an other color then self
            if(color != playerColors[playerturn]) {
                findEmptyHouseSlot();
            } else {
                //donothing
            }
        }
        //if it is a different color. find an empty house by giving the playerturn of the color as a parameter
        //move the piece back to their house
    }

    function findEmptyHouseSlot(kickedOutPlayer) {
        playerIdx = kickedOutPlayer * 4;
        for (let i = playerIdx; i < playerIdx + 4; i++) {
            piecePosX = pieceList[i][0];
            piecePosY = pieceList[i][1];
            housePosX = houseList[i][0];
            housePosY = houseList[i][1];
            //console.log(piecePosX + "   " + housePosX + "   " + piecePosY + "   " + housePosY);
            if(!(piecePosX === housePosX && piecePosY === housePosY)) {
                return [housePosX, housePosY];
            }
        }
        console.error("No free house found");
        return null;
    }

    function rollDice() {
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        const diceImage = document.querySelector('.dice-image');

        switch (randomNumber) {
            case 1:
                diceImage.src = '/assets/images/one.png';
                rolledDice = 1;
                break;
            case 2:
                diceImage.src = '/assets/images/two.png';
                rolledDice = 2;
                break;
            case 3:
                diceImage.src = '/assets/images/three.png';
                rolledDice = 3;
                break;
            case 4:
                diceImage.src = '/assets/images/four.png';
                rolledDice = 4;
                break;
            case 5:
                diceImage.src = '/assets/images/five.png';
                rolledDice = 5;
                break;
            case 6:
                diceImage.src = '/assets/images/six.png';
                rolledDice = 6;
                break;
            default:
                console.error('Invalid random number.');
                break;
            }
            if(rolledDice === 6 && isOnePieceOut()) {
                timesPlayerRolled = 0;
                changeTextFieldText("Player " + (playerturn + 1) + " rolled a " + rolledDice + ". Choose a Piece to get out or move a Piece on the board. It's your turn again!");
                return;
            } else if(rolledDice === 6) {
                timesPlayerRolled = 0;
                changeTextFieldText("Player " + (playerturn + 1) + " rolled a " + rolledDice + ". Choose a Piece to get out. It's your turn again!");
                return;
            } else if(isOnePieceOut()) {
                console.log(" tesssa");
                timesPlayerRolled = 0;
                changeTextFieldText("Player " + (playerturn + 1) + " rolled a " + rolledDice + ". Choose the Piece to move. It's Player " + getNextPlayerturn() + "'s turn next!");
                //updatePlayerturn();
            } else if(timesPlayerRolled != 2) {
                timesPlayerRolled = timesPlayerRolled + 1;
                changeTextFieldText("Player " + (playerturn + 1) + " rolled a " + rolledDice + ". It's your turn again!");
            } else {
                timesPlayerRolled = 0;
                changeTextFieldText("Player " + (playerturn + 1) + " rolled a " + rolledDice + ". It's Player " + getNextPlayerturn() + "'s turn!");
                updatePlayerturn();
            }
    }

    function getNextPlayerturn() {
        if(playerturn === playeramount - 1) {
            return "1";
        } else {
            if(playeramount === 1) {
                return 1;
            } else {
            return (playerturn + 2);
            }
        }
    }
    function createRow(rowData, rowIndex) {
        const row = document.createElement('div');
        row.className = 'game-row';
    
        const maxHeight = Math.max(...rowData.map(cellData => cellData.className === 'empty' ? 0 : 1));
    
        rowData.forEach((cellData, columnIndex) => {
            const cell = createCell(cellData.className, rowIndex, columnIndex);
    
            cell.style.height = maxHeight > 0 ? '35px' : 'auto';
    
            cell.addEventListener('click', function () {
                console.log(`Clicked on cell at row ${rowIndex}, column ${columnIndex}`);
            });
    
            row.appendChild(cell);
        });
    
        return row;
    }

    function isPlayerCirclePlaceable(cell) {
        if(cell.classList.contains('empty')) {
            return false;
        }

        return !(cell.querySelector('.player-circle') !== null);
    }

    function findCellByRowAndColumn(row, column) {
        const targetRow = gameBoard.children[row];

        if (targetRow) {
            const targetCell = targetRow.children[column];

            if (targetCell) {
                return targetCell;
            } else {
                console.error('Cell not found.');
                return null;
            }
        } else {
            console.error('Cell not found.');
            return null;
        }
    }

    function getCoordinatesFromCell(cell) {
        const row = parseInt(cell.getAttribute('data-row'));
        const column = parseInt(cell.getAttribute('data-column'));
        return [row, column];
    }
    

    function createPlayerCircle(color) {
        const playerCircle = document.createElement('div');
        playerCircle.className = 'player-circle';
        playerCircle.style.backgroundColor = color;
        return playerCircle;
    }

    function addPlayerCircle(cell, color) {
        if (isPlayerCirclePlaceable(cell)) {
            const playerCircle = createPlayerCircle(color);
            cell.appendChild(playerCircle);
            console.log(cell.children);
        }
    }

    function removePlayerCircle(cell) {
        if(!isPlayerCirclePlaceable(cell)) {
            const playerCircle = cell.querySelector('.player-circle');
        
            if (playerCircle) {
                cell.removeChild(playerCircle);
            }
        }
    }

    function logList(list) {
        for (let i = 0; i < list.length; i++) {
            console.log(`Item ${i + 1}: [${list[i].join(', ')}]`);
        }
    }

    function createGameBoard() {
        const rowsData = [
            [
                { className: 'housep1' },{ className: 'housep1' },{ className: 'empty' },{ className: 'empty' },{ className: 'goalp1'},{ className: 'tile' },{ className: 'tile' },{ className: 'empty' },{ className: 'empty' },{ className: 'housep3' },{ className: 'housep3' },
            ],
            [
                { className: 'housep1' },{ className: 'housep1' },{ className: 'empty' },{ className: 'empty' },{ className: 'tile' },{ className: 'goalp1' },{ className: 'tile' },{ className: 'empty' },{ className: 'empty' },{ className: 'housep3' },{ className: 'housep3' },
            ],
            [
                { className: 'empty' },{ className: 'empty' },{ className: 'empty' },{ className: 'empty' },{ className: 'tile' },{ className: 'goalp1' },{ className: 'tile' },{ className: 'empty' },{ className: 'empty' },{ className: 'empty' },{ className: 'empty' },
            ],
            [
                { className: 'empty' },{ className: 'empty' },{ className: 'empty' },{ className: 'empty' },{ className: 'tile' },{ className: 'goalp1' },{ className: 'tile' },{ className: 'empty' },{ className: 'empty' },{ className: 'empty' },{ className: 'empty' },
            ],
            [
                { className: 'tile' },{ className: 'tile' },{ className: 'tile' },{ className: 'tile' },{ className: 'tile' },{ className: 'goalp1' },{ className: 'tile' },{ className: 'tile' },{ className: 'tile' },{ className: 'tile' },{ className: 'goalp3' },
            ],
            [
                { className: 'tile' },{ className: 'goalp2' },{ className: 'goalp2' },{ className: 'goalp2' },{ className: 'goalp2' },{ className: 'empty' },{ className: 'housep3' },{ className: 'housep3' },{ className: 'housep3' },{ className: 'housep3' },{ className: 'tile' },
            ],
            [
                { className: 'goalp2' },{ className: 'tile' },{ className: 'tile' },{ className: 'tile' },{ className: 'tile' },{ className: 'goalp4' },{ className: 'tile' },{ className: 'tile' },{ className: 'tile' },{ className: 'tile' },{ className: 'tile' },
            ],
            [
                { className: 'empty' },{ className: 'empty' },{ className: 'empty' },{ className: 'empty' },{ className: 'tile' },{ className: 'goalp4' },{ className: 'tile' },{ className: 'empty' },{ className: 'empty' },{ className: 'empty' },{ className: 'empty' },
            ],
            [
                { className: 'empty' },{ className: 'empty' },{ className: 'empty' },{ className: 'empty' },{ className: 'tile' },{ className: 'goalp4' },{ className: 'tile' },{ className: 'empty' },{ className: 'empty' },{ className: 'empty' },{ className: 'empty' },
            ],
            [
                { className: 'housep2' },{ className: 'housep2' },{ className: 'empty' },{ className: 'empty' },{ className: 'tile' },{ className: 'goalp4' },{ className: 'tile' },{ className: 'empty' },{ className: 'empty' },{ className: 'housep4' },{ className: 'housep4' },
            ],
            [
                { className: 'housep2' },{ className: 'housep2' },{ className: 'empty' },{ className: 'empty' },{ className: 'tile' },{ className: 'tile' },{ className: 'goalp4' },{ className: 'empty' },{ className: 'empty' },{ className: 'housep4' },{ className: 'housep4' },
            ],
        ];
        rowsData.forEach((rowData, rowIndex) => {
            gameBoard.appendChild(createRow(rowData, rowIndex)); 
        });
    }

    function createGameInterface() {
        const interfaceContainer = document.createElement('div');
        interfaceContainer.className = 'game-interface';

        const dice = createDice();
        const magicDice = createMagicDice();

        const textContainer = document.createElement('div');
        textContainer.className = 'text-container';
        const textField = document.createElement('div');
        textField.className = 'informationBoard';
        textField.textContent = 'Roll the dice to begin playing';
        textContainer.append(textField);

        interfaceContainer.appendChild(dice);
        interfaceContainer.appendChild(magicDice);
        interfaceContainer.appendChild(textContainer);

        return interfaceContainer;
    }
});