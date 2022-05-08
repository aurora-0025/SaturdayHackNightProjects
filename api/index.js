const app = require('express')();
const { Client } = require('@notionhq/client')
const cors = require("cors");
require('dotenv').config();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.use(cors());

const NOTION_DB_ID = process.env.NOTION_DB_ID
const NOTION_INTEGRATION_TOKEN = process.env.NOTION_INTEGRATION_TOKEN

const notion = new Client({ auth: NOTION_INTEGRATION_TOKEN})

app.get('/api/fetchpages', jsonParser, async (req, res)=> {
    try {
        const notionPages = await notion.databases.query({
            database_id: NOTION_DB_ID,
            sorts: [ 
                {
                    "property": "Upvotes",
                    "direction": "descending"
                }
            ]
        })
        const pages = []
        notionPages.results.map((page)=>{
            let obj = {
                id: page.id,
                title: page.properties.Name.title[0].text.content,
                desc: page.properties.Description.rich_text[0].text.content,
                upvotes: page.properties.Upvotes.number,
                downvotes: page.properties.Downvotes.number,
                tags: page.properties.Tags.multi_select.map((tag)=> {return {name: tag.name,
                color: tag.color}})
            }
            pages.push(obj)
        })
        res.send(pages)
    } catch(error) {
        console.log(error);
    }
    
})

app.post('/api/submitpoll', jsonParser, async (req,res)=> {
    console.log(req.body);
    const {name:title, description:desc, tags} = req.body;

    const formattedTags = tags.map(tag=>{ return {
        name: tag
    }})




    try {
        await notion.pages.create({
            parent: { database_id: NOTION_DB_ID },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: title
                            }
                        }
                    ]
                },
                Description: {
                    rich_text: [
                        {
                            text: {
                                content: desc
                            }
                        }
                    ]
                },
                Upvotes: {
                    number: 0       
                },
                Downvotes: {
                    number: 0     
                },
                Tags: {
                    multi_select: formattedTags
                }
            }
        }).then(()=> {
            res.send("OK")})
    } catch (error) {
        res.status(400)
        console.log(error);
    }
})

app.post('/api/upvote', jsonParser, async (req,res)=> {
    console.log(req.body);
    const {pageId} = req.body;
    try {
       const page = await notion.pages.retrieve({ page_id: pageId });
       const votes = page.properties.Upvotes.number + 1;


       await notion.pages.update({
           page_id: pageId,
           properties: {
               Upvotes: {
                   number: votes
               }
           }
       })

       res.send(`${votes}`)


    } catch (error) {
        console.log(error);
    }
})

app.post('/api/downvote', jsonParser, async (req,res)=> {
    const {pageId} = req.body;
    try {
       const page = await notion.pages.retrieve({ page_id: pageId });
       const votes = page.properties.Downvotes.number + 1;

       await notion.pages.update({
           page_id: pageId,
           properties: {
               Downvotes: {
                   number: votes
               }
           }
       })
       res.send(`${votes}`)

    } catch (error) {
        console.log(error);
    }
})

module.exports = app;