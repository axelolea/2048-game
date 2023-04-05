class Game {
    constructor(level) {
        this.level = level
        this.steps = 0
        this.table = document.getElementById('table')
        this.tableValues = this.createTable()
        this.backupTable = []
        this.controls = {
            37: 'left',
            100: 'left',
            38: 'up',
            104: 'up',
            39: 'right',
            102: 'right',
            40: 'down',
            98: 'down'
        }
        this.colors = {
            0: '#ccc0b3',
            2: '#eee4da',
            4: '#ece0c8',
            8: '#f2b179',
            16: '#f59563',
            32: '#f67c5f',
            64: '#f65e3b',
            128: '#edcf72',
            256: '#edcc61'
        }
    }

    createTable (){
        return new Array(this.level).fill(0).map(x => Array(this.level).fill(x))
    }

    render (){
        this.table.innerHTML = ''
        this.tableValues.forEach(row => {
            const rowDiv = document.createElement('div')
            rowDiv.classList.add('rowTable')
            row.forEach(col => {
                const colDiv = document.createElement('div')
                if(col !== 0) colDiv.innerText = col.toString()
                colDiv.style.backgroundColor = this.colors[col]
                colDiv.classList.add('colTable')
                rowDiv.append(colDiv)
            })
            this.table.append(rowDiv)
        })
    }

    getVoidValues (){
        const pos = []
        this.tableValues.forEach((elRow, i) => {
            elRow.forEach((elCol, j) => {
                if (elCol === 0) pos.push([i, j])
            })
        })
        if (!pos) {
            throw new Error('Perdiste')
        }
        return pos
    }

    getValue() {
        if(this.steps < 50) return 2
        else if(this.steps < 400){
            const randInt = Math.random() * 100
            return randInt > 80 ? 4 : 2
        }
    }

    run() {
        const randomIters = (Math.random() * 100) < 80 ? 2 : 3
        for(let i = 1; i <= randomIters; i++){
            this.setNumberRandom()
        }
        this.render()
    }

    setNumberRandom ()
    {
        const positions = this.getVoidValues()
        const randPos = ~~(Math.random() * 100) % positions.length
        const pos = positions[randPos]
        this.tableValues[pos[0]][pos[1]] = this.getValue()
    }

    action (event) {

        if(!Object.keys(this.controls).includes(event.keyCode.toString())) return

        this.backupTable = this.tableValues
        this.tableValues = this.createTable()

        const keyPressed = this.controls[event.keyCode]

        if(keyPressed === 'right'){
            this.rightMove()
        }
        else if(keyPressed === 'left'){
            this.leftMove()
        }
        else if(keyPressed === 'up'){
            this.upMove()
        }
        else if(keyPressed === 'down'){
            this.downMove()
        }
        if(!this.comparativeTables()){
            this.setNumberRandom()
            this.render()
        }
    }

    comparativeTables (){
        let flag = true
        for(let i = 0; i < this.level; i++){
            for(let j = 0; j < this.level; j++){
                if(flag && this.tableValues[i][j] !== this.backupTable[i][j]) flag = false
            }
        }
        return flag
    }

    upMove(){
        for(let j = 0; j < this.level; j++){
            let row = []
            for(let i = 0; i < this.level; i++){
                row.push(this.backupTable[i][j])
            }
            const newRow = this.comparativeGroups(row)
            if(newRow === -1) continue
            for(let i = 0; i < newRow.length; i++){
                this.tableValues[i][j] = newRow[i]
            }
        }
    }

    downMove(){
        for(let j = 0; j < this.level; j++){
            let row = []
            for(let i = this.level - 1; i >= 0; i--) {
                row.push(this.backupTable[i][j])
            }
            const newRow = this.comparativeGroups(row)
            if(newRow === -1) continue
            newRow.reverse()
            for(let i = 0; i < newRow.length; i++){
                this.tableValues[i][j] = newRow[i]
            }
        }
    }

    rightMove(){
        this.backupTable.map((row, i) => {
	    const newRow = this.comparativeGroups(row.slice().reverse())
            if(newRow === -1) return
            this.tableValues[i] = newRow.reverse()
        })
    }

    leftMove(){
        this.backupTable.forEach((row, i) => {
            const newRow = this.comparativeGroups(row)
            if(newRow === -1) return
            this.tableValues[i] = newRow
        })
    }

    comparativeGroups (row){
        let newRow = row.filter(el => el !== 0)

        if(newRow.length === 0) return -1

        if(newRow.length > 1){
            let pos = 0
            while(pos < newRow.length){
                if(!newRow[pos] || !newRow[pos + 1]){
                    pos++
                    continue
                }
                if(newRow[pos] === newRow[pos + 1]){
                    const newValue = newRow[pos] * 2
                    newRow.splice(pos, 2, newValue)
                }
                pos++
            }
        }

        if(newRow.length < this.level){
            const addZeros = this.level - newRow.length
            newRow = newRow.concat(Array(addZeros).fill(0))
        }

        return newRow
    }
}



const game = new Game(4)


game.run()

window.addEventListener('keydown', (e) => game.action(e))
