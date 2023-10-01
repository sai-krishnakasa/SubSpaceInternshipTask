const express = require("express")
const analyticsMiddleware = require('./middlewares/analytics')
const fetchBlogs = require('./helper');
const app = express()
const PORT=8000;
const cache = new Map();

function removeFirstCacheElement() {
    const firstKey = cache.keys().next().value;
    if (firstKey) {
      cache.delete(firstKey);
      console.log(`Removed element with key: ${firstKey} from cache.`);
    }
  }

// remove cache for every one minute
setInterval(removeFirstCacheElement,60000) 

app.listen(PORT,()=>{
    console.log(`Server Started on ${PORT}.........`);
})

app.get('/api/blog-stats',(req,res)=>{
    analyticsMiddleware(cache,req,res,()=>{
        res.json(res.locals.stats)
    })
    
})
app.get('/api/blog-search',async (req,res)=>{
    const query = req.query["query"] || "";
    if(cache.has(query)){
        const cachedResult = cache.get(query);
        return res.send(cachedResult);
    }
    try{
        const cachedResult = cache.get(req.query);
        if (cachedResult) return cachedResult;
        const data =await fetchBlogs();
        res.header('Content-Type', 'application/json');
        if(query){
            const filteredBlogs = data.blogs.filter((blog)=>blog.title.toLowerCase().includes(req.query["query"]))
            response = {"found":filteredBlogs.length,"blogs":filteredBlogs}
            cache.set(query,response)
            res.send(response)
        }
        else{
            res.send({"blogs":data.blogs})
        }
        }
    catch(error){
        res.json({error:"HTTP Request error, something went wrong while fetching the data"})
    }
    
})
