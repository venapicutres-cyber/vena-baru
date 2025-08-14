import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  User, Client, Project, TeamMember, Transaction, Package, AddOn, 
  Card, FinancialPocket, Asset, Contract, Lead, ClientFeedback, 
  PromoCode, SocialMediaPost, SOP, Notification, TeamProjectPayment, 
  TeamPaymentRecord, RewardLedgerEntry, Profile, Revision, PerformanceNote
} from '../types';

// Transform database row to application type
const transformUser = (row: any): User => ({
  id: row.id,
  email: row.email,
  password: row.password,
  fullName: row.full_name,
  role: row.role,
  permissions: row.permissions || []
});

const transformClient = (row: any): Client => ({
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
});

const transformProject = (row: any): Project => ({
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
  invoiceSignature: row.invoice_signature
});

const transformTeamMember = (row: any): TeamMember => ({
  id: row.id,
  name: row.name,
  role: row.role,
  email: row.email,
  phone: row.phone,
  standardFee: row.standard_fee,
  noRek: row.no_rek,
  rewardBalance: row.reward_balance,
  rating: row.rating,
  performanceNotes: [], // Will be loaded separately
  portalAccessId: row.portal_access_id
});

// Custom hooks for each data type
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      setUsers(data?.map(transformUser) || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (user: Omit<User, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: user.email,
          password: user.password,
          full_name: user.fullName,
          role: user.role,
          permissions: user.permissions || []
        })
        .select()
        .single();
      
      if (error) throw error;
      const newUser = transformUser(data);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          email: updates.email,
          password: updates.password,
          full_name: updates.fullName,
          role: updates.role,
          permissions: updates.permissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      const updatedUser = transformUser(data);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, setUsers, loading, addUser, updateUser, deleteUser, refetch: fetchUsers };
};

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setClients(data?.map(transformClient) || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: Omit<Client, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: client.name,
          email: client.email,
          phone: client.phone,
          instagram: client.instagram,
          since: client.since,
          status: client.status,
          client_type: client.clientType,
          last_contact: client.lastContact,
          portal_access_id: client.portalAccessId
        })
        .select()
        .single();
      
      if (error) throw error;
      const newClient = transformClient(data);
      setClients(prev => [newClient, ...prev]);
      return newClient;
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          instagram: updates.instagram,
          since: updates.since,
          status: updates.status,
          client_type: updates.clientType,
          last_contact: updates.lastContact,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      const updatedClient = transformClient(data);
      setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
      return updatedClient;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      setClients(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, setClients, loading, addClient, updateClient, deleteClient, refetch: fetchClients };
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('date', { ascending: false });
      if (error) throw error;
      setProjects(data?.map(transformProject) || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          project_name: project.projectName,
          client_name: project.clientName,
          client_id: project.clientId,
          project_type: project.projectType,
          package_name: project.packageName,
          package_id: project.packageId,
          add_ons: project.addOns,
          date: project.date,
          deadline_date: project.deadlineDate,
          location: project.location,
          progress: project.progress,
          status: project.status,
          active_sub_statuses: project.activeSubStatuses || [],
          total_cost: project.totalCost,
          amount_paid: project.amountPaid,
          payment_status: project.paymentStatus,
          team: project.team,
          notes: project.notes,
          accommodation: project.accommodation,
          drive_link: project.driveLink,
          client_drive_link: project.clientDriveLink,
          final_drive_link: project.finalDriveLink,
          start_time: project.startTime,
          end_time: project.endTime,
          image: project.image,
          promo_code_id: project.promoCodeId,
          discount_amount: project.discountAmount || 0,
          shipping_details: project.shippingDetails,
          dp_proof_url: project.dpProofUrl,
          printing_cost: project.printingCost || 0,
          transport_cost: project.transportCost || 0
        })
        .select()
        .single();
      
      if (error) throw error;
      const newProject = transformProject(data);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Map frontend fields to database fields
      if (updates.projectName !== undefined) updateData.project_name = updates.projectName;
      if (updates.clientName !== undefined) updateData.client_name = updates.clientName;
      if (updates.clientId !== undefined) updateData.client_id = updates.clientId;
      if (updates.projectType !== undefined) updateData.project_type = updates.projectType;
      if (updates.packageName !== undefined) updateData.package_name = updates.packageName;
      if (updates.packageId !== undefined) updateData.package_id = updates.packageId;
      if (updates.addOns !== undefined) updateData.add_ons = updates.addOns;
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.deadlineDate !== undefined) updateData.deadline_date = updates.deadlineDate;
      if (updates.location !== undefined) updateData.location = updates.location;
      if (updates.progress !== undefined) updateData.progress = updates.progress;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.activeSubStatuses !== undefined) updateData.active_sub_statuses = updates.activeSubStatuses;
      if (updates.totalCost !== undefined) updateData.total_cost = updates.totalCost;
      if (updates.amountPaid !== undefined) updateData.amount_paid = updates.amountPaid;
      if (updates.paymentStatus !== undefined) updateData.payment_status = updates.paymentStatus;
      if (updates.team !== undefined) updateData.team = updates.team;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.accommodation !== undefined) updateData.accommodation = updates.accommodation;
      if (updates.driveLink !== undefined) updateData.drive_link = updates.driveLink;
      if (updates.clientDriveLink !== undefined) updateData.client_drive_link = updates.clientDriveLink;
      if (updates.finalDriveLink !== undefined) updateData.final_drive_link = updates.finalDriveLink;
      if (updates.startTime !== undefined) updateData.start_time = updates.startTime;
      if (updates.endTime !== undefined) updateData.end_time = updates.endTime;
      if (updates.image !== undefined) updateData.image = updates.image;
      if (updates.promoCodeId !== undefined) updateData.promo_code_id = updates.promoCodeId;
      if (updates.discountAmount !== undefined) updateData.discount_amount = updates.discountAmount;
      if (updates.shippingDetails !== undefined) updateData.shipping_details = updates.shippingDetails;
      if (updates.dpProofUrl !== undefined) updateData.dp_proof_url = updates.dpProofUrl;
      if (updates.printingCost !== undefined) updateData.printing_cost = updates.printingCost;
      if (updates.transportCost !== undefined) updateData.transport_cost = updates.transportCost;
      if (updates.isEditingConfirmedByClient !== undefined) updateData.is_editing_confirmed_by_client = updates.isEditingConfirmedByClient;
      if (updates.isPrintingConfirmedByClient !== undefined) updateData.is_printing_confirmed_by_client = updates.isPrintingConfirmedByClient;
      if (updates.isDeliveryConfirmedByClient !== undefined) updateData.is_delivery_confirmed_by_client = updates.isDeliveryConfirmedByClient;
      if (updates.confirmedSubStatuses !== undefined) updateData.confirmed_sub_statuses = updates.confirmedSubStatuses;
      if (updates.clientSubStatusNotes !== undefined) updateData.client_sub_status_notes = updates.clientSubStatusNotes;
      if (updates.subStatusConfirmationSentAt !== undefined) updateData.sub_status_confirmation_sent_at = updates.subStatusConfirmationSentAt;
      if (updates.completedDigitalItems !== undefined) updateData.completed_digital_items = updates.completedDigitalItems;
      if (updates.invoiceSignature !== undefined) updateData.invoice_signature = updates.invoiceSignature;

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      const updatedProject = transformProject(data);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, setProjects, loading, addProject, updateProject, deleteProject, refetch: fetchProjects };
};

// Similar hooks for other entities
export const usePackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase.from('packages').select('*');
      if (error) throw error;
      setPackages(data?.map((row: any) => ({
        id: row.id,
        name: row.name,
        price: row.price,
        physicalItems: row.physical_items || [],
        digitalItems: row.digital_items || [],
        processingTime: row.processing_time,
        photographers: row.photographers,
        videographers: row.videographers
      })) || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPackage = async (pkg: Omit<Package, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert({
          name: pkg.name,
          price: pkg.price,
          physical_items: pkg.physicalItems,
          digital_items: pkg.digitalItems,
          processing_time: pkg.processingTime,
          photographers: pkg.photographers,
          videographers: pkg.videographers
        })
        .select()
        .single();
      
      if (error) throw error;
      const newPackage = {
        id: data.id,
        name: data.name,
        price: data.price,
        physicalItems: data.physical_items || [],
        digitalItems: data.digital_items || [],
        processingTime: data.processing_time,
        photographers: data.photographers,
        videographers: data.videographers
      };
      setPackages(prev => [...prev, newPackage]);
      return newPackage;
    } catch (error) {
      console.error('Error adding package:', error);
      throw error;
    }
  };

  const updatePackage = async (id: string, updates: Partial<Package>) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update({
          name: updates.name,
          price: updates.price,
          physical_items: updates.physicalItems,
          digital_items: updates.digitalItems,
          processing_time: updates.processingTime,
          photographers: updates.photographers,
          videographers: updates.videographers,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      const updatedPackage = {
        id: data.id,
        name: data.name,
        price: data.price,
        physicalItems: data.physical_items || [],
        digitalItems: data.digital_items || [],
        processingTime: data.processing_time,
        photographers: data.photographers,
        videographers: data.videographers
      };
      setPackages(prev => prev.map(p => p.id === id ? updatedPackage : p));
      return updatedPackage;
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  };

  const deletePackage = async (id: string) => {
    try {
      const { error } = await supabase.from('packages').delete().eq('id', id);
      if (error) throw error;
      setPackages(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return { packages, setPackages, loading, addPackage, updatePackage, deletePackage, refetch: fetchPackages };
};

// Profile hook (single record)
export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase.from('profile').select('*').limit(1).single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      
      if (data) {
        setProfile({
          fullName: data.full_name,
          email: data.email,
          phone: data.phone,
          companyName: data.company_name,
          website: data.website,
          address: data.address,
          bankAccount: data.bank_account,
          authorizedSigner: data.authorized_signer,
          idNumber: data.id_number,
          bio: data.bio,
          incomeCategories: data.income_categories || [],
          expenseCategories: data.expense_categories || [],
          projectTypes: data.project_types || [],
          eventTypes: data.event_types || [],
          assetCategories: data.asset_categories || [],
          sopCategories: data.sop_categories || [],
          projectStatusConfig: data.project_status_config || [],
          notificationSettings: data.notification_settings || { newProject: true, paymentConfirmation: true, deadlineReminder: true },
          securitySettings: data.security_settings || { twoFactorEnabled: false },
          briefingTemplate: data.briefing_template,
          termsAndConditions: data.terms_and_conditions
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (updates.fullName !== undefined) updateData.full_name = updates.fullName;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.companyName !== undefined) updateData.company_name = updates.companyName;
      if (updates.website !== undefined) updateData.website = updates.website;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.bankAccount !== undefined) updateData.bank_account = updates.bankAccount;
      if (updates.authorizedSigner !== undefined) updateData.authorized_signer = updates.authorizedSigner;
      if (updates.idNumber !== undefined) updateData.id_number = updates.idNumber;
      if (updates.bio !== undefined) updateData.bio = updates.bio;
      if (updates.incomeCategories !== undefined) updateData.income_categories = updates.incomeCategories;
      if (updates.expenseCategories !== undefined) updateData.expense_categories = updates.expenseCategories;
      if (updates.projectTypes !== undefined) updateData.project_types = updates.projectTypes;
      if (updates.eventTypes !== undefined) updateData.event_types = updates.eventTypes;
      if (updates.assetCategories !== undefined) updateData.asset_categories = updates.assetCategories;
      if (updates.sopCategories !== undefined) updateData.sop_categories = updates.sopCategories;
      if (updates.projectStatusConfig !== undefined) updateData.project_status_config = updates.projectStatusConfig;
      if (updates.notificationSettings !== undefined) updateData.notification_settings = updates.notificationSettings;
      if (updates.securitySettings !== undefined) updateData.security_settings = updates.securitySettings;
      if (updates.briefingTemplate !== undefined) updateData.briefing_template = updates.briefingTemplate;
      if (updates.termsAndConditions !== undefined) updateData.terms_and_conditions = updates.termsAndConditions;

      const { data, error } = await supabase
        .from('profile')
        .upsert(updateData)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedProfile = {
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        companyName: data.company_name,
        website: data.website,
        address: data.address,
        bankAccount: data.bank_account,
        authorizedSigner: data.authorized_signer,
        idNumber: data.id_number,
        bio: data.bio,
        incomeCategories: data.income_categories || [],
        expenseCategories: data.expense_categories || [],
        projectTypes: data.project_types || [],
        eventTypes: data.event_types || [],
        assetCategories: data.asset_categories || [],
        sopCategories: data.sop_categories || [],
        projectStatusConfig: data.project_status_config || [],
        notificationSettings: data.notification_settings || { newProject: true, paymentConfirmation: true, deadlineReminder: true },
        securitySettings: data.security_settings || { twoFactorEnabled: false },
        briefingTemplate: data.briefing_template,
        termsAndConditions: data.terms_and_conditions
      };
      
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, setProfile, loading, updateProfile, refetch: fetchProfile };
};

// Generic hook for simple CRUD operations
export const useSupabaseTable = <T extends { id: string }>(
  tableName: string,
  transform?: (row: any) => T
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data: rows, error } = await supabase.from(tableName).select('*');
      if (error) throw error;
      setData(rows?.map(transform || ((row: any) => row as T)) || []);
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<T, 'id'>) => {
    try {
      const { data: newRow, error } = await supabase
        .from(tableName)
        .insert(item as any)
        .select()
        .single();
      
      if (error) throw error;
      const newItem = transform ? transform(newRow) : newRow as T;
      setData(prev => [...prev, newItem]);
      return newItem;
    } catch (error) {
      console.error(`Error adding ${tableName}:`, error);
      throw error;
    }
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    try {
      const { data: updatedRow, error } = await supabase
        .from(tableName)
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      const updatedItem = transform ? transform(updatedRow) : updatedRow as T;
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      setData(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error(`Error deleting ${tableName}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, setData, loading, addItem, updateItem, deleteItem, refetch: fetchData };
};