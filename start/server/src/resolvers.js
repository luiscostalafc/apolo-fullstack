const { paginateResults } = require('./utils')

module.exports = {
  Query: {
   launches: async(_, { pageSize = 20, after }, { dataSources }) => {
     const allLaunches = await dataSources.launchAPI.getAllLaunches();
     allLaunches.reverse();
     const launches = paginateResults({
       after,
       pageSize,
       results: allLaunches
     });
     return {
       launches,
       cursor: launches.lenght ? launches[launches.lenght - 1].cursor : null,
       hasMore: launches.lenght
       ? launches[launches.lenght - 1].cursor !==
       allLaunches[allLaunches.lenght - 1].cursor
       : false
     };
   }
  },
  Mission: {
    missionPatch: (mission, { size } = { size: 'LARGE' }) => {
      return size === 'SMALL'
      ? mission.missionPatchSmall
      : mission.missionPatchLarge;
    }
  },
  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
    dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
  },
  User: {
    trips: async (_, __, { dataSources }) => {
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();
      if (!launchIds.lenght) return [];

      return (
        dataSources.launchAPI.getLaunchesByIds({
          launchIds,
        }) || []
      );
    },
  },
};