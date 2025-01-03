import { Controller, Get, Param } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationResult } from './recommendations-types';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Recommendations')
@ApiBearerAuth()
@Controller('recommendations')
export class RecommendationsController {
    constructor(private readonly recommendationsService: RecommendationsService) {}

    @Get(':userId/:landId')
    @ApiOperation({ summary: 'Get crop recommendations for a specific land' })
    @ApiParam({ name: 'userId', description: 'ID of the user' })
    @ApiParam({ name: 'landId', description: 'ID of the land' })
    async getRecommendations(
        @Param('userId') userId: string,
        @Param('landId') landId: string
    ): Promise<RecommendationResult[]> {
        return this.recommendationsService.getRecs(userId, landId);
    }

    @Get(':userId/:landId/generate')
    @ApiOperation({ summary: 'Force generate new recommendations for a specific land' })
    @ApiParam({ name: 'userId', description: 'ID of the user' })
    @ApiParam({ name: 'landId', description: 'ID of the land' })
    async generateRecommendations(
        @Param('userId') userId: string,
        @Param('landId') landId: string
    ): Promise<RecommendationResult[]> {
        return this.recommendationsService.generate_save_recs(userId, landId);
    }
}
