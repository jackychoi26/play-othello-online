export default class Game {

    constructor(private grid: number[][]) { }

    static create = (size: number): Game | undefined => {
        if (size > 26) {
            console.error("❌ Error: Currently we do not support board size larger than 26")
            return
        }

        const row = []
        let column: number[][] = []

        for (let _ = 0; _ < size; _++) {
            row.push(0)
            column.push([0])
        }

        column.fill(row, 0, size)

        return new Game(column)
    }

    currentState = (): number[][] => {
        console.log(this.grid)
        return this.grid
    }
}