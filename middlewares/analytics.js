
const { response } = require("express");
const _ = require("lodash")
const getDataFromCURL = require('../helper')

const analyticsMiddleware = async(cache,req,res,next) =>{
       
    try{
        const cachedResult = cache.get("blog-stats"); // Check if the result is in the cache
        if (cachedResult) {
          res.locals.stats = cachedResult;
          next();
        } else {
            const data = await getDataFromCURL();
            const noOfBlogs= data.blogs.length;
            const blogWithLongestTitle = _.maxBy(data.blogs, 'title.length');
            // Determine the number of blogs with titles containing the word "privacy"
            const privacyBlogs = _.filter(data.blogs, blog => _.includes(blog.title.toLowerCase(), 'privacy'));
            // Create an array of unique blog titles (no duplicates)
            const uniqueBlogTitles =_.uniq(_.map(data.blogs, 'title'));
            const statistics = {
                noOfBlogs,
                blogWithLongestTitle,
                privacyBlogs,
                uniqueBlogTitles
            }
            cache.set("blog-stats", statistics);
            res.locals.stats=statistics;
            next()
        }
    }
    catch (error) {
            res.status(500).json({ error: error.message });
            console.error(error);
          }
          
}


module.exports = analyticsMiddleware;