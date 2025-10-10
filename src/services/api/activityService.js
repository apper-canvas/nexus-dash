import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const activityService = {
  getAll: async () => {
    await delay(300);
    return [...activities].sort((a, b) => b.timestamp - a.timestamp);
  },

  getById: async (id) => {
    await delay(200);
    const activity = activities.find((a) => a.Id === parseInt(id));
    if (!activity) throw new Error("Activity not found");
    return { ...activity };
  },

  getByContactId: async (contactId) => {
    await delay(250);
    return activities
      .filter((a) => a.contactId === parseInt(contactId))
      .sort((a, b) => b.timestamp - a.timestamp);
  },

  getByDealId: async (dealId) => {
    await delay(250);
    return activities
      .filter((a) => a.dealId === parseInt(dealId))
      .sort((a, b) => b.timestamp - a.timestamp);
  },

  create: async (activityData) => {
    await delay(400);
    const maxId = activities.reduce((max, a) => Math.max(max, a.Id), 0);
    const newActivity = {
      ...activityData,
      Id: maxId + 1,
      timestamp: Date.now(),
      userId: "user1"
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  delete: async (id) => {
    await delay(300);
    const index = activities.findIndex((a) => a.Id === parseInt(id));
    if (index === -1) throw new Error("Activity not found");
    activities.splice(index, 1);
    return true;
  }
};