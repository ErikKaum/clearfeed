import { following } from "../lensApi/queries"
import { random } from "mathjs"

const relations = async (account) => {
    
    const res = await following(account)
    const iAmFollowing = res.data.following.items

    const all = await getAll(iAmFollowing)
    const newAll = []
    all.forEach((item) => {
      let search = item.profile.id
      const count = all.reduce((n, x) => n + (x.profile.id === search), 0);
      newAll.push({...item, count: count})
    })
    
    function getUniqueListBy(arr) {
        return [...new Map(arr.map(item => [item.profile.id, item])).values()]
    }

    const output = getUniqueListBy(newAll)
     
    output.sort((a,b) => b.count - a.count);
    const smallOutput = output.slice(0,50)

    const realOutput = smallOutput.map((item) => {
        return {id: item.profile.id , relation : '2nd'}
    })

    return realOutput
}  

const getAll = async(iAmFollowing) => {
    // Set a timeout so we don't spam the lens endpoint like hell
    const sleep = s => new Promise(r => setTimeout(r, s*1000));

    const all = []
    const run = iAmFollowing.map(async(item) => {
      const list = []
      let cursor = "{\"offset\":0}"
      let stat = true

      if (item.profile.stats.totalFollowers > 1000) {
        stat = false
      }

      while (stat === true) {
        const res2 = await following(item.profile.ownedBy, cursor)
        await sleep(15 * random());

        // take away later
        stat = false
    
        cursor = await res2.data.following.pageInfo.next
        list.push(...res2.data.following.items)
        
        if (list.length === res2.data.following.pageInfo.totalCount) {
            stat = false
        }
      }
      all.push(...list)
    })
    await Promise.all(run)
    return all
}
export default relations