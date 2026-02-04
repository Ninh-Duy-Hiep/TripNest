-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GUEST', 'HOST', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('EntirePlace', 'PrivateRoom', 'SharedRoom');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(255) NOT NULL,
    "avatar" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'GUEST',
    "status" "Status" NOT NULL DEFAULT 'Active',
    "identityNumber" VARCHAR(255),
    "bio" TEXT,
    "becomeHostAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refresh_Token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Refresh_Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listings" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "province" VARCHAR(255) NOT NULL,
    "ward" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "maxGuests" INTEGER NOT NULL,
    "bedRooms" INTEGER NOT NULL,
    "beds" INTEGER NOT NULL,
    "bathRooms" INTEGER NOT NULL,
    "pricePerNight" DOUBLE PRECISION NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listings_Images" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "imageName" VARCHAR(255) NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Listings_Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listings_Amenities" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,
    "customName" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Listings_Amenities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "Refresh_Token_userId_idx" ON "Refresh_Token"("userId");

-- CreateIndex
CREATE INDEX "Listings_hostId_idx" ON "Listings"("hostId");

-- CreateIndex
CREATE INDEX "Listings_province_idx" ON "Listings"("province");

-- CreateIndex
CREATE INDEX "Listings_pricePerNight_idx" ON "Listings"("pricePerNight");

-- CreateIndex
CREATE INDEX "Listings_province_status_idx" ON "Listings"("province", "status");

-- CreateIndex
CREATE INDEX "Listings_propertyType_idx" ON "Listings"("propertyType");

-- CreateIndex
CREATE INDEX "Listings_Images_listingId_idx" ON "Listings_Images"("listingId");

-- CreateIndex
CREATE INDEX "Listings_Amenities_listingId_idx" ON "Listings_Amenities"("listingId");

-- CreateIndex
CREATE INDEX "Listings_Amenities_amenityId_idx" ON "Listings_Amenities"("amenityId");

-- AddForeignKey
ALTER TABLE "Refresh_Token" ADD CONSTRAINT "Refresh_Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listings" ADD CONSTRAINT "Listings_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listings_Images" ADD CONSTRAINT "Listings_Images_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listings_Amenities" ADD CONSTRAINT "Listings_Amenities_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
