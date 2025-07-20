import { Router } from 'express';
import { CampaignController } from '../controllers/campanhaController';

const router = Router();

// CRUD básico de campanhas
router.post('/',  async(req, res)=>{
    await CampaignController.createCampaign(req, res);
} );

router.post("/")
router.get('/', CampaignController.getCampaigns);
router.get('/:id', CampaignController.getCampaignById);
router.put('/:id', CampaignController.updateCampaign);
router.delete('/:id', CampaignController.deleteCampaign);

// Gerenciamento de tags

router.post('/',  async(req, res)=>{
    await CampaignController.addGoogleAdsTag(req, res);
} );

router.put('/:id/google-ads-tag', CampaignController.updateGoogleAdsTag);


router.post('/',  async(req, res)=>{
    await CampaignController.addMetaAdsTag(req, res);
} );



router.put('/:id/meta-ads-tag', CampaignController.updateMetaAdsTag);



router.post('/',  async(req, res)=>{
    await CampaignController.addXAdsTag(req, res);
} );

router.put('/:id/x-ads-tag', CampaignController.updateXAdsTag);

// Estatísticas
router.get('/:id/stats', CampaignController.getCampaignStats);

export default router;
