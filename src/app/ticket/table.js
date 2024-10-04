import jsPDF from 'jspdf';
import 'jspdf-autotable'

const data = [
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],

    ['','','','','','','','',''],

    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','','']
]

const sizeTypeMap = {
    1: {
        startY: 0.108,
        cellWidth: 24.3,
        cellWidth4: 6, 
        cellHeight: 21.5,
        cellHeight5: 39,
        fontSize: 10
    },
    2: {
        startY: 0.12,
        cellWidth: 24,
        cellWidth4: 7, 
        cellHeight: 21,
        cellHeight5: 39.8,
        fontSize: 10
    },
    3: {
        startY: 0.12,
        cellWidth: 23.8,
        cellWidth4: 8.2, 
        cellHeight: 21,
        cellHeight5: 39.8,
        fontSize: 9
    }
}

export default function createTable (doc, pos, comb1, comb2, comb3, comb4, type) {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const sizeType = sizeTypeMap[type]

    fillComb(comb1, pos, 0, 0)
    fillComb(comb2, pos, 0, 5)
    fillComb(comb3, pos, 6, 0)
    fillComb(comb4, pos, 6, 5)

    doc.autoTable({
        columnStyles: {
            4: { cellWidth: sizeType.cellWidth4, halign: 'center', valign: 'middle' }
        },
        body: data,
        theme: 'grid',
        showHead: 'never',
        startY: height*sizeType.startY,
        margin: { left: 5.1, bottom: 0 },
        styles: {
            cellWidth: sizeType.cellWidth,
            halign: 'center', valign: 'middle',
            fillColor: false, 
            lineColor: [0, 0, 0],
            lineWidth: 0.0,
            minCellHeight: sizeType.cellHeight,
            maxCellHeight: sizeType.cellHeight,
            fontSize: sizeType.fontSize
        },
        didParseCell: function (data) {
            if (data.row.index === 5) {
              data.cell.styles.minCellHeight = sizeType.cellHeight5
              data.cell.styles.maxCellHeight = sizeType.cellHeight5
            }
          }
    })
}

const fillComb = (comb, pos, rowAdd, columnAdd) => {
    comb.forEach((item, index) => {
        const coordenates = pos[index]
        const row = coordenates[0] + rowAdd
        const column = coordenates[1] + columnAdd
        data[row][column] = item
    })
}