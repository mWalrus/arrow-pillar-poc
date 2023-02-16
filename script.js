const START_DATE = new Date(2022, 7, 1)
const END_DATE = new Date(2025, 9, 1)

const PILLAR_HEIGHT = 20 // pixels
const PILLAR_COLOR = 'yellow'
// we will have access to these in the code base normally
const START_FY = 2022
const END_FY = 2028
const FY_START_MONTH = 7
const MONTH_PERCENT = 100 / 11
const DAY_PERCENT = MONTH_PERCENT / 31

function yearAndMonth(y, m) {
  // step back a year and adjust the month if its below sep
  if (m >= FY_START_MONTH) return [y + 1, m - FY_START_MONTH]
  // otherwise adjust fy month for the current fy
  else return [y, m - FY_START_MONTH + 12]
}

function showDates() {
  document.getElementById('start').innerText = `Start date: ${START_DATE.toDateString()}`
  document.getElementById('end').innerText = `End date: ${END_DATE.toDateString()}`
}

function constructPillar() {
  showDates()

  const cells = document.querySelectorAll('.cell')
  // return early cus there are no cells
  if (!cells) return
  // 1. figure out which cells to begin and end drawing in
  let startDateYear = START_DATE.getFullYear()
  let endDateYear = END_DATE.getFullYear()
  let endDateMonth = END_DATE.getMonth()
  let startDateMonth = START_DATE.getMonth()

  let [startY, startM] = yearAndMonth(startDateYear, startDateMonth)

  let [endY, endM] = yearAndMonth(endDateYear, endDateMonth)

  // this acts an an array index for the collection of "cell"s
  const startCellIndex = startY - START_FY
  const endCellIndex = END_FY - endY + 1

  console.log(`start fiscal year: ${startY}\nend fiscal year: ${endY}`)

  // 2. calculate the width of the pillar for a given cell
  // interate though each year
  for (let i = startCellIndex, yearOffset = 0; yearOffset <= endCellIndex; yearOffset++, i++) {
    console.log(`\nSegment ${yearOffset + 1}:`)
    // skip if we're in an fy outside of the span
    if (i < 0) continue

    // 2.1 get the width

    // Since we dont care about the month and day for the "in-between" years for the width calculation
    // we can set them to 1st of Jan in these cases.
    // However, if we're handling the start or the end dates, we want to consider the month and day.
    let month = 0
    let day = 0
    let shouldRecievePosition = false
    let shouldFloatRight = false

    // consider month and day
    if (yearOffset === 0) {
      month = startM
      day = START_DATE.getDate()
      shouldFloatRight = true
    }
    else if (yearOffset === endCellIndex) {
      month = endM
      day = END_DATE.getDate()
    }

    const segmentWidth = calculateSegmentWidth(startY + yearOffset, month, day, startY, endY)

    console.log(`width: ${segmentWidth}%`)
    // 2.2 calculate the "float" (left/right positioning) of the pillar segment
    if (segmentWidth < 100.0) {
      shouldRecievePosition = true
    }

    console.log('should recieve position:', shouldRecievePosition)
    console.log(`position: ${shouldRecievePosition ? shouldFloatRight ? 'right' : 'left' : 'unchanged'}`)

    // 2.3 draw each segment of the pillars in order
    drawSegment(cells[i], segmentWidth, shouldRecievePosition && shouldFloatRight)
  }
  
}

function calculateSegmentWidth(y, m, d, startYear, endYear) {
  console.log(`YYYY/MM/DD: ${y}/${m}/${d}`)
  // the start fy is outside the range of fys
  if (y < START_FY) {
    return 100.0
  }

  // if the current segments index is greater than start date and also less than end date
  // it should occupy the entire width of its parent
  if (y > startYear && y < endYear) {
    return 100.0 // percent
  }

  let monthPercent =  m * MONTH_PERCENT
  let dayPercent = Math.max(d - 1, 0) * DAY_PERCENT
  let totalPercent = monthPercent + dayPercent

  totalPercent = totalPercent > 100.0 ? 100.0 : totalPercent
  if (y === startYear) {
    return 100.0 - totalPercent
  }
  return totalPercent
}

function drawSegment(currentCell, segmentWidth, shouldFloatRight) {
  const cellHeight = currentCell.offsetHeight
  const top = (cellHeight / 2)
  const segment = document.createElement('div')

  segment.style.position = 'absolute'
  segment.style.backgroundColor = PILLAR_COLOR
  segment.style.height = PILLAR_HEIGHT
  segment.style.width = `${segmentWidth}%`
  segment.style.top = `${top}%`
  segment.innerText = '\xa0'
  if (shouldFloatRight) {
    segment.style.right = '0'
  }

  currentCell.appendChild(segment)
}

