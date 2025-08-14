import { supabase } from '../lib/supabase';
import { 
  Client, Project, TeamMember, Transaction, Package, AddOn,
  Card, FinancialPocket, Asset, Contract, Lead, ClientFeedback,
  PromoCode, SocialMediaPost, SOP, Notification, TeamProjectPayment,
  TeamPaymentRecord, RewardLedgerEntry, Revision, PerformanceNote
} from '../types';

// Generic CRUD service
export class DataService<T extends { id: string }> {
  constructor(private tableName: string, private transform?: (row: any) => T) {}

  async getAll(): Promise<T[]> {
    try {
      const { data, error } = await supabase.from(this.tableName).select('*');
      if (error) throw error;
      return data?.map(this.transform || ((row: any) => row as T)) || [];
    } catch (error) {
      console.error(`Error fetching ${this.tableName}:`, error);
      throw error;
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return this.transform ? this.transform(data) : data as T;
    } catch (error) {
      console.error(`Error fetching ${this.tableName} by id:`, error);
      return null;
    }
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(item as any)
        .select()
        .single();
      
      if (error) throw error;
      return this.transform ? this.transform(data) : data as T;
    } catch (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return this.transform ? this.transform(data) : data as T;
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from(this.tableName).delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting ${this.tableName}:`, error);
      throw error;
    }
  }
}

// Specialized services for complex operations
export const projectService = {
  async getProjectsWithRevisions(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          revisions (*)
        `);
      
      if (error) throw error;
      
      return data?.map((row: any) => ({
        id: row.id,
        projectName: row.project_name,
        clientName: row.client_name,
        clientId: row.client_id,
        projectType: row.project_type,
        packageName: row.package_name,
        packageId: row.package_id,
        addOns: row.add_ons || [],
        date: row.date,
        deadlineDate: row.deadline_date,
        location: row.location,
        progress: row.progress,
        status: row.status,
        activeSubStatuses: row.active_sub_statuses || [],
        totalCost: row.total_cost,
        amountPaid: row.amount_paid,
        paymentStatus: row.payment_status,
        team: row.team || [],
        notes: row.notes,
        accommodation: row.accommodation,
        driveLink: row.drive_link,
        clientDriveLink: row.client_drive_link,
        finalDriveLink: row.final_drive_link,
        startTime: row.start_time,
        endTime: row.end_time,
        image: row.image,
        promoCodeId: row.promo_code_id,
        discountAmount: row.discount_amount,
        shippingDetails: row.shipping_details,
        dpProofUrl: row.dp_proof_url,
        printingCost: row.printing_cost,
        transportCost: row.transport_cost,
        isEditingConfirmedByClient: row.is_editing_confirmed_by_client,
        isPrintingConfirmedByClient: row.is_printing_confirmed_by_client,
        isDeliveryConfirmedByClient: row.is_delivery_confirmed_by_client,
        confirmedSubStatuses: row.confirmed_sub_statuses || [],
        clientSubStatusNotes: row.client_sub_status_notes || {},
        subStatusConfirmationSentAt: row.sub_status_confirmation_sent_at || {},
        completedDigitalItems: row.completed_digital_items || [],
        invoiceSignature: row.invoice_signature,
        revisions: row.revisions?.map((rev: any) => ({
          id: rev.id,
          date: rev.date,
          adminNotes: rev.admin_notes,
          deadline: rev.deadline,
          freelancerId: rev.freelancer_id,
          status: rev.status,
          freelancerNotes: rev.freelancer_notes,
          driveLink: rev.drive_link,
          completedDate: rev.completed_date
        })) || []
      })) || [];
    } catch (error) {
      console.error('Error fetching projects with revisions:', error);
      throw error;
    }
  },

  async addRevision(projectId: string, revision: Omit<Revision, 'id'>): Promise<Revision> {
    try {
      const { data, error } = await supabase
        .from('revisions')
        .insert({
          project_id: projectId,
          date: revision.date,
          admin_notes: revision.adminNotes,
          deadline: revision.deadline,
          freelancer_id: revision.freelancerId,
          status: revision.status,
          freelancer_notes: revision.freelancerNotes,
          drive_link: revision.driveLink,
          completed_date: revision.completedDate
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        date: data.date,
        adminNotes: data.admin_notes,
        deadline: data.deadline,
        freelancerId: data.freelancer_id,
        status: data.status,
        freelancerNotes: data.freelancer_notes,
        driveLink: data.drive_link,
        completedDate: data.completed_date
      };
    } catch (error) {
      console.error('Error adding revision:', error);
      throw error;
    }
  },

  async updateRevision(revisionId: string, updates: Partial<Revision>): Promise<void> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      
      if (updates.adminNotes !== undefined) updateData.admin_notes = updates.adminNotes;
      if (updates.deadline !== undefined) updateData.deadline = updates.deadline;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.freelancerNotes !== undefined) updateData.freelancer_notes = updates.freelancerNotes;
      if (updates.driveLink !== undefined) updateData.drive_link = updates.driveLink;
      if (updates.completedDate !== undefined) updateData.completed_date = updates.completedDate;

      const { error } = await supabase
        .from('revisions')
        .update(updateData)
        .eq('id', revisionId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating revision:', error);
      throw error;
    }
  }
};

export const teamService = {
  async getTeamMembersWithNotes(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          performance_notes (*)
        `);
      
      if (error) throw error;
      
      return data?.map((row: any) => ({
        id: row.id,
        name: row.name,
        role: row.role,
        email: row.email,
        phone: row.phone,
        standardFee: row.standard_fee,
        noRek: row.no_rek,
        rewardBalance: row.reward_balance,
        rating: row.rating,
        portalAccessId: row.portal_access_id,
        performanceNotes: row.performance_notes?.map((note: any) => ({
          id: note.id,
          date: note.date,
          note: note.note,
          type: note.type
        })) || []
      })) || [];
    } catch (error) {
      console.error('Error fetching team members with notes:', error);
      throw error;
    }
  },

  async addPerformanceNote(teamMemberId: string, note: Omit<PerformanceNote, 'id'>): Promise<PerformanceNote> {
    try {
      const { data, error } = await supabase
        .from('performance_notes')
        .insert({
          team_member_id: teamMemberId,
          date: note.date,
          note: note.note,
          type: note.type
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        date: data.date,
        note: data.note,
        type: data.type
      };
    } catch (error) {
      console.error('Error adding performance note:', error);
      throw error;
    }
  }
};

// Export service instances
export const clientService = new DataService<Client>('clients', (row: any) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  instagram: row.instagram,
  since: row.since,
  status: row.status,
  clientType: row.client_type,
  lastContact: row.last_contact,
  portalAccessId: row.portal_access_id
}));

export const transactionService = new DataService<Transaction>('transactions', (row: any) => ({
  id: row.id,
  date: row.date,
  description: row.description,
  amount: row.amount,
  type: row.type,
  projectId: row.project_id,
  category: row.category,
  method: row.method,
  pocketId: row.pocket_id,
  cardId: row.card_id,
  printingItemId: row.printing_item_id,
  vendorSignature: row.vendor_signature
}));

export const assetService = new DataService<Asset>('assets', (row: any) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  purchaseDate: row.purchase_date,
  purchasePrice: row.purchase_price,
  serialNumber: row.serial_number,
  status: row.status,
  notes: row.notes
}));

export const leadService = new DataService<Lead>('leads', (row: any) => ({
  id: row.id,
  name: row.name,
  contactChannel: row.contact_channel,
  location: row.location,
  status: row.status,
  date: row.date,
  notes: row.notes
}));

export const contractService = new DataService<Contract>('contracts', (row: any) => ({
  id: row.id,
  contractNumber: row.contract_number,
  clientId: row.client_id,
  projectId: row.project_id,
  signingDate: row.signing_date,
  signingLocation: row.signing_location,
  clientName1: row.client_name1,
  clientAddress1: row.client_address1,
  clientPhone1: row.client_phone1,
  clientName2: row.client_name2,
  clientAddress2: row.client_address2,
  clientPhone2: row.client_phone2,
  shootingDuration: row.shooting_duration,
  guaranteedPhotos: row.guaranteed_photos,
  albumDetails: row.album_details,
  digitalFilesFormat: row.digital_files_format,
  otherItems: row.other_items,
  personnelCount: row.personnel_count,
  deliveryTimeframe: row.delivery_timeframe,
  dpDate: row.dp_date,
  finalPaymentDate: row.final_payment_date,
  cancellationPolicy: row.cancellation_policy,
  jurisdiction: row.jurisdiction,
  vendorSignature: row.vendor_signature,
  clientSignature: row.client_signature
}));