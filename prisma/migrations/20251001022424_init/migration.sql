-- CreateTable
CREATE TABLE `OrderData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `orderdate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
