export async function fetchData(id)

const id = ""
export async function fetchData(id){
  const results = require('../mockdata.ts')

  if (id) {
    return results.find(result =>
      result.id === id
    );
  }

  return results
}
