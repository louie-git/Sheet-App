

export default {
  
  paginate : function (skip = 1, page, limit){

    const data = {}
    skip += 1 // + 1 to the next row that has the actual data.
    const to = (page * limit) + skip - 1  // -1 to get the exact number of limit.
    const from = ( (page * limit) - limit ) + skip // skip is to avoid displaying the header.

    return {from, to}
  }
}