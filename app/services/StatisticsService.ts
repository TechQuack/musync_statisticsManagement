import {PrismaClient, TopListenedArtist, TopListenedMusic, User} from "@prisma/client";

export class StatisticsService {

    public async getArtist(user: User, rank: number) {
        if (!this.verifyRank(rank)) {
            throw new Error(`invalid rank: ${rank} less than 1 ot greater than 3`);
        }
        if (!this.checkUserExistence(user)) {
            throw new Error('not existent user');
        }
        return new PrismaClient().topListenedArtist.findFirst({
            where: {
                AND: {
                    top_ranking: rank,
                    userMusicStatistic: {
                        user_id: user.user_id
                    }
                }
            }
        });
    }

    public async getMusic(user: User, rank: number) {
        if (!this.verifyRank(rank)) {
            throw Error(`invalid rank :${rank} greater than 3 or less than 1`);
        }
        if (!this.checkUserExistence(user)) {
            throw Error('invalid user');
        }
        return new PrismaClient().topListenedMusic.findFirst({
            where: {
                AND: {
                    top_ranking: rank,
                    userMusicStatistic: {
                        user_id: user.user_id
                    }
                }
            }
        });
    }

    public async getTopListenedArtists(user: User) {
        if (!this.checkUserExistence(user)) {
            throw Error('invalid user');
        }
        return new PrismaClient().topListenedArtist.findMany({
            where: {
                userMusicStatistic: {
                    user_id: user.user_id
                }
            }
        });
    }

    public async getTopListenedMusics(user: User) {
        if (!this.checkUserExistence(user)) {
            throw Error(`invalid user`);
        }
        return new PrismaClient().topListenedMusic.findMany({
            where: {
                userMusicStatistic: {
                    user_id: user.user_id
                }
            }
        });
    }

    public async getTopArtistsFromAPI(user: User, token: string) {
        if (!this.checkUserExistence(user)) {
            throw Error(`invalid user`);
        }
        const url = "https://api.spotify.com/v1/me/top/artists?limit=3&offset=0"
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        let topArtists = await response.json();
        topArtists = topArtists.items;
        let res = []
        for (let i : number = 0; i < 3; i++) {
            res.push({
                top_listened_artist: topArtists[i].name,
                top_ranking: i + 1
            })
        }
        return res;
    }

    public async getTopMusicsFromAPI(user: User, token: string) {
        if (!this.checkUserExistence(user)) {
            throw Error(`invalid user`);
        }
        const url = "https://api.spotify.com/v1/me/top/tracks?limit=3&offset=0";
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        let topMusics = await response.json();
        topMusics = topMusics.items;
        let res = [];
        for (let i : number = 0; i < 3; i++) {
            res.push({
                top_listened_music: topMusics[i].name,
                artist_name: topMusics[i].artists[0].name,
                top_ranking: i + 1
            })
        }
        return res;
    }

    public async updateTopListenedArtists(user: User, artists: TopListenedArtist[]) : Promise<void> {
        if (!this.checkUserExistence(user)) {
            throw Error(`invalid user`);
        }
        const prisma = new PrismaClient();
        prisma.userMusicStatistic.update({
            where: {
                user_id: user.user_id
            },
            data: {
                top_listened_artist: {
                    set: artists
                }
            }
        })
    }

    public async updateTopListenedMusics(user: User, musics: TopListenedMusic[]) : Promise<void> {
        if (!this.checkUserExistence(user)) {
            throw Error(`invalid user`);
        }
        const prisma = new PrismaClient();
        prisma.userMusicStatistic.update({
            where: {
                user_id: user.user_id
            },
            data: {
                top_listened_music: {
                    set: musics
                }
            }
        });
    }

    public async updateUserInformation(user: User) {
        if (!this.checkUserExistence(user)) {
            throw Error(`invalid user`);
        }
        const prisma = new PrismaClient();
        prisma.user.update({
            where: {
                user_id: user.user_id
            },
            data: {
                is_certified: user.is_certified,
                favorite_music: user.favorite_music,
                favorite_musician: user.favorite_musician,
                favorite_genre: user.favorite_genre
            }
        })
    }

    public async sendRequestToAPI(user: User,url: string, token: string) {
        if (!this.checkUserExistence(user)) {
            throw Error(`invalid user`);
        }
        await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    public async updateTopListenedArtist(user: User, artist: TopListenedArtist, rank: number) : Promise<void> {
        if (!this.checkUserExistence(user)) {
            throw Error(`invalid user`);
        }
        if (!this.verifyRank(rank)) {
            throw Error('invalid rank');
        }
        const prisma = new PrismaClient();
        prisma.userMusicStatistic.update({
            where: {
                user_id: user.user_id,
            },
            data: {
                top_listened_artist: {
                    updateMany: {
                        where: {
                            top_ranking: rank
                        },
                        data: {
                            top_listened_artist: artist.top_listened_artist,

                        }
                    }
                }
            }
        })
    }

    public async updateTopListenedMusic(user: User, music: TopListenedMusic, rank: number) : Promise<void> {
        if (!this.checkUserExistence(user)) {
            throw Error(`invalid user`);
        }
        if (!this.verifyRank(rank)) {
            throw Error('invalid rank');
        }
        const prisma = new PrismaClient();
        prisma.userMusicStatistic.update({
            where: {
                user_id: user.user_id
            },
            data: {
                top_listened_music: {
                    updateMany: {
                        where: {
                            top_ranking: rank
                        },
                        data: {
                            top_listened_music: music.top_listened_music,
                            artist_name: music.artist_name
                        }
                    }
                }
            }
        })
    }



    //tools

    /*private async getSpotifyUserAuthToken() : Promise<string> {
        const authOptions = {
            url: "https://accounts.spotify.com/api/token",
            headers: {
                'Authorization': 'Basic '
                    + Buffer.from(`${process.env.CLIENT_ID} : ${process.env.CLIENT_SECRET}`)
                        .toString('base64'),
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };
        const res = request.post(authOptions, function (error, response) {
            if (error || response.statusCode !== 200) {
                throw error;
            }
        });
        if (res.response == null) {
            throw Error("error while obtaining token");
        }
        return res.response.body.access_token;
    }*/

    private verifyRank(rank: number) {
        return rank >= 1 && rank <= 3;
    }

    private checkUserExistence(user: User) {
        const prisma: PrismaClient = new PrismaClient();
        return prisma.user.findUnique({
            where: {
                user_id: user.user_id
            }
        }) != null;
    }
}