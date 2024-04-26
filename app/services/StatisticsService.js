import {PrismaClient, User, TopListenedArtist, UserMusicStatistic, TopListenedMusic} from '@prisma/client';

export default class StatisticsService {

    static async getArtist(user, rank) {
        const prisma = new PrismaClient();
        if (rank < 1 || rank > 3) {
            throw Error(`invalid rank :${rank} greater than 3 or less than 1`);
        }
        return prisma.topListenedArtist.findFirst({
            where: {
                AND: {
                    top_ranking: rank,
                    userMusicStatistic: {
                        user_id: user.id
                    }
                }
            }
        });
    }

    static async getMusic(user, rank) {
        const prisma = new PrismaClient();
        if (rank < 1 || rank > 3) {
            throw Error(`invalid rank :${rank} greater than 3 or less than 1`);
        }
        return prisma.topListenedMusic.findFirst({
           where: {
               AND: {
                   top_ranking: rank,
                   userMusicStatistic: {
                       user_id: user.id
                   }
               }
           }
        });
    }

}