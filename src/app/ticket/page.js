"use client";

import getCombinations from "../combinations";
import read from "../readCsv";
import jsPDF from 'jspdf';
import createTable from "./table";
import { useState } from "react";

export default function Ticket() {
    const posPeliculas = [
        [0, 0], [0, 2],
        [1, 1], [1, 2],
        [2, 0], [2, 3],
        [3, 0], [3, 2],
        [4, 1], [4, 2]
    ]

    const pos = [
        [0, 0], [0, 2],
        [1, 0], [1, 3],
        [2, 1], [2, 2],
        [3, 0], [3, 2],
        [4, 1], [4, 3]
    ]

    const mapData = {
        1: ["/bingoPeliculas.png", "/songsPeliculas.csv", posPeliculas],
        2: ["/bingoActual.png", "/songsActual.csv", pos],
        3: ["/bingoAntiguo.png", "/songsAntiguo.csv", pos]
    }

    const [num, setNum] = useState(null)
    const [type, setType] = useState(1)

    const print = () => {
        read(mapData[type][1]).then(results => printPDF(results))
    }

    const printPDF = async (results) => {
        const numbers = results.slice(1).map(r => r[1])
        const x = 10;
        const combinations = getCombinations(numbers, x)
        console.log(combinations.length)

        const doc = new jsPDF('p', 'mm', 'a4');
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();

        const img = await fetch(mapData[type][0])
        .then(res => res.blob())
        .then(blob => new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        }));

        const add = parseInt(combinations.length / num)
        for (let i = 0; i < num; i++) {
            const index = i + add * i
            doc.addImage(img, 'PNG', 0, 0, width, height, '', 'FAST')
            const add2 = parseInt(add / 4)
            const comb1 = index
            const comb2 = index+1*add2
            const comb3 = index+2*add2
            const comb4 = index+3*add2

            doc.setFontSize(8)
            doc.text(""+comb1, width*0.02, height*0.48)
            doc.text(""+comb2, width*0.52, height*0.48)
            doc.text(""+comb3, width*0.02, height*0.975)
            doc.text(""+comb4, width*0.52, height*0.975)
            createTable(doc, mapData[type][2], combinations[comb1], combinations[comb2], combinations[comb3], combinations[comb4], type)

            if (i + 1 < num) {
                doc.addPage()
            }
        }

        doc.output('dataurlnewwindow')
        //doc.save("a4.pdf"); // will save the file in the current working directory
    }
    return (
        <div>
            <button onClick={print}>Imprimir</button>
            <input type="number" value={num} onChange={e => setNum(parseInt(e.target.value))}></input>
            <select value={type} onChange={e => setType(e.target.value)}>
                <option value={1}>Bingo Peliculas</option>
                <option value={2}>Bingo Actual</option>
                <option value={3}>Bingo Antiguo</option>
            </select>
        </div>
    )
}