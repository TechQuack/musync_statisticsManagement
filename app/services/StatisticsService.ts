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

    public async updateTopListenedArtists(user: User, token: string) : Promise<string> {
        if (!this.checkUserExistence(user)) {
            const topArtists = await this.getTopArtistsFromAPI(user, token);
            const prisma = new PrismaClient();
            prisma.userMusicStatistic.update({
                where: {
                    user_id: user.user_id
                },
                data: {
                    top_listened_artist: {
                        createMany: {
                            data: topArtists
                        }
                    }
                }
            })
            return "user updated";
        }
        return this.createUserStatistics(user, token);
    }

    public async updateTopListenedMusics(user: User, token: string) : Promise<string> {
        if (this.checkUserExistence(user)) {
            const topMusics = await this.getTopMusicsFromAPI(user, token);
            const prisma = new PrismaClient();
            prisma.userMusicStatistic.update({
                where: {
                    user_id: user.user_id
                },
                data: {
                    top_listened_music: {
                        createMany: {
                            data: topMusics
                        }
                    }
                }
            });
            return "user updated";
        }
        return this.createUserStatistics(user, token);
    }

    public async updateUserInformation(user: User, token: string) {
        const prisma = new PrismaClient();
        if (this.checkUserExistence(user)) {
            await prisma.user.update({
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
            return "user updated";
        }
        return this.createUserStatistics(user, token);
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

    private async createUserStatistics(user: User, token: string) {
        const prisma = new PrismaClient();
        const topArtists = await this.getTopArtistsFromAPI(user, token);
        const topMusics = await this.getTopMusicsFromAPI(user, token);
        await prisma.userMusicStatistic.create({
            data: {
                user_id: user.user_id,
                top_listened_artist: {
                    createMany: {
                        data: topArtists
                    }
                },
                top_listened_music: {
                    createMany: {
                        data: topMusics
                    }
                }
            }
        });
        await prisma.user.create({
            data: {
                is_certified: user.is_certified,
                favorite_music: user.favorite_music,
                favorite_musician: user.favorite_musician,
                favorite_genre: user.favorite_genre,
                userMusicStatistic: {
                    connect: {
                        user_id: user.user_id
                    }
                }
            }
        })
        return "user created";
    }

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