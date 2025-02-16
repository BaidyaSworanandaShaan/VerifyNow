-- CreateTable
CREATE TABLE "CitizenshipInfo" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "birthplace" TEXT NOT NULL,
    "permanentAddress" TEXT NOT NULL,
    "wardNumber" INTEGER NOT NULL,
    "frontImg" TEXT NOT NULL,
    "backImg" TEXT NOT NULL,
    "userImg" TEXT NOT NULL,

    CONSTRAINT "CitizenshipInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CitizenshipInfo_userId_key" ON "CitizenshipInfo"("userId");

-- AddForeignKey
ALTER TABLE "CitizenshipInfo" ADD CONSTRAINT "CitizenshipInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
