const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


async function main(){
    const admin = await prisma.user.create({
        data:{
            name:"AKM Admin",
            email:"akm@akm.com",
            account_type:"admin",
            email_verified_at:new Date(),
            password:"$2a$10$VGd.ednsEzgx0hb7P3ark.HL.ck5XyJmfLROrpBgfehgS/Sri5d76",
        }
    })

    const users = await prisma.user.createMany({
		data:[
			{
				name:"Kwame Osei"
			}
		],
    })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })