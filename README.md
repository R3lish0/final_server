# How to use cool server things in 2 easy steps

step 1. the api

#########

GET "/"
RETURNS: [200] or [503]
EXPECT: "Hello from our server!"

#########

GET "/allusers"
RETURNS: [200] or [503]
EXPECT: JSON array of posts in such format:
[
    {
        content,
        favor,
        date,
    },
    ...
]

GET "/allusers-sorted"
RETURNS: [200] or [503]
EXPECT: JSON array of SORTED posts in such format:
[
    {
        content,
        favor,
        date,
    },
    ...
]

#########

POST "/createpost"
RETURNS: [201] or [503]
EXPECT: nothing (lol)
REQ FORMAT:
{
    content (string pls)
}

#########

PUT "/favor"
RETURNS: [200] or [503]
EXPECT: nothing
REQ FORMAT:
{
    id,
    favor, (like, 1 or -1)
}

#########

DELETE "/deletepost"
RETURNS: [200] or [503]
EXPECT: nothing
REQ FORMAT:
{
    id
}

step 2. the REAL truth

https://cuberule.com/