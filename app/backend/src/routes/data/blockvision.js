//implement blockvision api CALL, this one will be called every 10 minutes by a cron job

//the call is the following:
//API CALL IS THE FOLLOWING:

import blockvision from "@api/blockvision";

blockvision.auth(process.env.BLOCKVISION_API_KEY);
blockvision
  .retrieveTokenActivities({
    address: "0x290b7C691Ee1FB118120f43E1A24d68B45CB27FB",
    tokenAddress: "0x8f01C14F15966aE671035F1ED78334fC32a7AB6b",
    limit: "20",
  })
  .then(({ data }) => console.log(data))
  .catch((err) => console.error(err));

//ADD IT TO A ROUTE THAT WILL BE CALLED EVERY 10 MINUTES BY A CRON JOB

app.get("/token/holders", async (req, res) => {
  try {
    const activities = await blockvision.retrieveTokenActivities({
      address: "0x290b7C691Ee1FB118120f43E1A24d68B45CB27FB",
      tokenAddress: "0x8f01C14F15966aE671035F1ED78334fC32a7AB6b",
      limit: "20",
    });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
